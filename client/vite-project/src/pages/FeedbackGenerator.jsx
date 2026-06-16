import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import api from "../services/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { toast } from "sonner"
import { 
  Sparkles, 
  Copy, 
  Download, 
  ArrowRight, 
  Check, 
  Smile, 
  Meh, 
  Frown, 
  ArrowLeft,
  FileText,
  Clock,
  Printer
} from "lucide-react"

export default function FeedbackGenerator() {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState("input") // input, processing, result
  const [activeFeedback, setActiveFeedback] = useState(null)
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  })

  const feedbackContent = watch("content")

  // Support templates for quick insertion
  const templates = [
    {
      title: "Delayed Shipping Complaint",
      label: "Delayed Order",
      text: "I ordered a pair of shoes last Monday with 2-day priority delivery. It has been 8 days and my tracking number still says 'Label Created'. I need this for a birthday tomorrow. Help!"
    },
    {
      title: "Damaged Delivery Issue",
      label: "Damaged Item",
      text: "The package arrived today but the cardboard box was completely crushed. Upon opening it, the glass vase inside was shattered into pieces. I would like a refund or replacement."
    },
    {
      title: "Billing Discrepancy",
      label: "Billing Error",
      text: "My monthly subscription is supposed to be $15, but my bank statement shows I was billed $45 this morning. I did not purchase any add-ons. Please check this charge."
    }
  ]

  const applyTemplate = (tpl) => {
    setValue("title", tpl.title)
    setValue("content", tpl.text)
    toast.success(`Loaded "${tpl.label}" template`)
  }

  // Handle Form Submission
  const onSubmit = async (data) => {
    setLoading(true)
    setCurrentStep("processing")
    try {
      const response = await api.post("/api/feedback/create", {
        title: data.title,
        content: data.content,
      })

      if (response.data && response.data.success) {
        const item = response.data.feedback
        setActiveFeedback(item)
        // Start polling for worker completion
        startPolling(item.id)
      } else {
        toast.error("Failed to submit feedback.")
        setCurrentStep("input")
        setLoading(false)
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error creating feedback stream.")
      setCurrentStep("input")
      setLoading(false)
    }
  }

  // Polling mechanism to look for status: "resolved"
  const startPolling = (feedbackId) => {
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      try {
        const response = await api.post("/api/feedback/user-feedback")
        if (response.data && response.data.success) {
          const list = response.data.feedbacks || []
          const updatedItem = list.find(f => f.id === feedbackId)
          
          if (updatedItem && updatedItem.status) {
            const statusLower = updatedItem.status.toLowerCase()
            if (statusLower === "resolved") {
              setActiveFeedback(updatedItem)
              setCurrentStep("result")
              setLoading(false)
              toast.success("AI Resolution Generated successfully!")
              clearInterval(interval)
            } else if (statusLower === "failed") {
              setActiveFeedback(updatedItem)
              setCurrentStep("result")
              setLoading(false)
              toast.error("AI Generation failed due to API limitations.")
              clearInterval(interval)
            }
          }
        }
      } catch (error) {
        console.error("Polling error:", error)
      }

      // Safeguard: stop polling after 30 seconds (20 attempts)
      if (attempts >= 20) {
        clearInterval(interval)
        toast.warning("AI processing is taking longer than expected. Check Feedback History later.")
        setLoading(false)
        setCurrentStep("input")
      }
    }, 1500)
  }

  // Copy support draft to clipboard
  const handleCopy = () => {
    if (!activeFeedback?.aiReply) return
    navigator.clipboard.writeText(activeFeedback.aiReply)
    setCopied(true)
    toast.success("Draft copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  // Download resolution file
  const handleDownload = () => {
    if (!activeFeedback) return
    const text = `SENTRAFLOW SUPPORT RESOLUTION REPORT
=====================================
Title: ${activeFeedback.title}
Date: ${new Date(activeFeedback.createdAt).toLocaleString()}
Sentiment Score: ${activeFeedback.emotionScore}/100
Emotion Class: ${activeFeedback.emotion || "Neutral"}
Status: Resolved

ORIGINAL TICKET:
----------------
${activeFeedback.content}

AI DRAFT RESOLUTION REPLY:
--------------------------
${activeFeedback.aiReply || "No reply generated."}
`
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Resolution-${activeFeedback.title.replace(/\s+/g, "_")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Report downloaded as TXT!")
  }

  const handlePrint = () => {
    window.print()
  }

  const handleReset = () => {
    reset()
    setActiveFeedback(null)
    setCurrentStep("input")
  }

  const renderFormattedText = (text) => {
    if (!text) return null
    const paragraphs = text.split(/\n\n+/)
    return paragraphs.map((para, pIdx) => {
      const lines = para.split("\n")
      return (
        <p key={pIdx} className="mb-3 last:mb-0 leading-relaxed text-sm">
          {lines.map((line, lIdx) => {
            const parts = line.split(/(\*\*.*?\*\*)/g)
            return (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {parts.map((part, partIdx) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={partIdx} className="font-bold text-foreground">{part.slice(2, -2)}</strong>
                  }
                  return part
                })}
              </React.Fragment>
            )
          })}
        </p>
      )
    })
  }

  const getEmotionBadge = (emotion, score) => {
    const emo = emotion ? emotion.toLowerCase() : "neutral"
    let classes = "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200"
    let icon = <Meh className="h-4 w-4" />

    if (emo === "happy" || score < 30) {
      classes = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200"
      icon = <Smile className="h-4 w-4" />
    } else if (emo === "angry" || emo === "frustrated" || score > 60) {
      classes = "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200"
      icon = <Frown className="h-4 w-4" />
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${classes}`}>
        {icon} <span className="capitalize">{emotion || "Neutral"}</span> ({score}/100)
      </span>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold font-display tracking-tight">AI Resolution Generator</h2>
          <p className="text-muted-foreground text-sm">Input customer text to retrieve sentiment vectors and drafts.</p>
        </div>
      </div>

      {currentStep === "input" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick suggestions templates */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Quick Templates</h3>
            <div className="space-y-3">
              {templates.map((tpl, idx) => (
                <Card 
                  key={idx} 
                  className="hover:border-primary/50 cursor-pointer bg-card transition-all"
                  onClick={() => applyTemplate(tpl)}
                >
                  <CardHeader className="p-4 space-y-1">
                    <CardTitle className="text-sm font-bold flex items-center justify-between text-primary">
                      {tpl.label} <ArrowRight className="h-3 w-3" />
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">{tpl.text}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Core Input Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ingest Customer Ticket</CardTitle>
              <CardDescription>All fields are validated. Ingested items are immediately queued into the AI engine.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Ticket Title</label>
                  <Input
                    placeholder="Brief description of the customer's problem..."
                    {...register("title", {
                      required: "Title is required",
                      minLength: { value: 3, message: "Title must be at least 3 characters" }
                    })}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive font-medium mt-0.5">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground">Feedback Body Content</label>
                    <span className="text-[10px] text-muted-foreground font-mono">{feedbackContent?.length || 0} characters</span>
                  </div>
                  <textarea
                    rows={6}
                    placeholder="Paste email logs, customer reviews, or support complaints here..."
                    className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                    {...register("content", {
                      required: "Feedback content is required",
                      minLength: { value: 10, message: "Content must be at least 10 characters" }
                    })}
                  />
                  {errors.content && (
                    <p className="text-xs text-destructive font-medium mt-0.5">{errors.content.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={handleReset}>Clear</Button>
                <Button type="submit" className="font-semibold shadow-md">
                  <Sparkles className="mr-2 h-4 w-4" /> Process & Generate
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      {currentStep === "processing" && (
        <Card className="max-w-xl mx-auto py-12 text-center">
          <CardContent className="space-y-6">
            <div className="relative mx-auto h-16 w-16 flex items-center justify-center">
              <span className="h-full w-full rounded-full border-4 border-primary/20 border-t-primary animate-spin absolute" />
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-display">Ingesting Ticket stream</h3>
              <p className="text-muted-foreground text-xs max-w-sm mx-auto">
                Customer text is pushed to the Redis priority queue. Background worker is running emotional vectors and solving issue...
              </p>
            </div>

            <div className="bg-muted/30 border border-border/50 rounded-lg p-4 max-w-sm mx-auto text-left font-mono text-[11px] text-muted-foreground space-y-1.5">
              <div className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-500" /> Connecting Redis Client...</div>
              <div className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-500" /> Computing Emotion index...</div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-amber-500 animate-spin" /> Resolving support draft via Gemini...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === "result" && activeFeedback && (
        <div className="space-y-6">
          {/* Action Header bar */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Generate Another
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Export (.TXT)
              </Button>
              <Button size="sm" onClick={handleCopy}>
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                Copy Draft
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block print:space-y-6">
            {/* Analysis card details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Telemetry Analysis</CardTitle>
                  <CardDescription>Processed database vectors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Sentiment Classification</span>
                    <div>{getEmotionBadge(activeFeedback.emotion, activeFeedback.emotionScore)}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Telemetry Index</span>
                    <div className="text-xl font-bold flex items-center justify-between">
                      <span>{activeFeedback.emotionScore} / 100</span>
                      <span className="text-xs text-muted-foreground">(Lower is happier)</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          activeFeedback.emotionScore > 60 ? 'bg-rose-500' : activeFeedback.emotionScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${activeFeedback.emotionScore}%` }} 
                      />
                    </div>
                  </div>

                  <div className="border-t border-border/50 pt-4 space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Database ID:</span>
                      <span className="font-mono text-[10px] text-foreground select-all">{activeFeedback.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processed At:</span>
                      <span className="text-foreground">{new Date(activeFeedback.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* original feedback ticket snippet */}
              <Card className="print:hidden">
                <CardHeader>
                  <CardTitle>Original Ticket Text</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground bg-muted/30 border p-3 rounded-lg leading-relaxed max-h-[200px] overflow-y-auto italic">
                    "{activeFeedback.content}"
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Generated AI support reply block */}
            <Card className="lg:col-span-2 print:border-none print:shadow-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-primary flex items-center gap-1.5">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" /> Support Draft Resolution
                  </CardTitle>
                  <CardDescription>Tailored support resolution generated by Gemini</CardDescription>
                </div>
                <span className={`hidden print:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                  activeFeedback.status && activeFeedback.status.toLowerCase() === 'resolved' 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                    : 'bg-rose-100 text-rose-800 border-rose-200'
                }`}>
                  {activeFeedback.status || "Pending"}
                </span>
              </CardHeader>
              <CardContent>
                <div className="w-full min-h-[300px] max-h-[450px] overflow-y-auto text-sm leading-relaxed border border-border/70 p-5 rounded-xl bg-card text-foreground/90 font-sans focus:outline-none resize-none font-medium shadow-inner print:border-none print:shadow-none print:p-0 select-text">
                  {renderFormattedText(activeFeedback.aiReply || "Draft empty or unavailable.")}
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground print:hidden">
                Review this resolution draft carefully before replying to the customer. You can edit the text within your own email client.
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
