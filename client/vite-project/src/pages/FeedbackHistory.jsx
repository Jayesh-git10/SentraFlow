import React, { useState, useEffect } from "react"
import api from "../services/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/Dialog"
import { toast } from "sonner"
import { 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Smile, 
  Meh, 
  Frown, 
  Clock, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Copy,
  Download,
  Check,
  Printer
} from "lucide-react"

export default function FeedbackHistory() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [emotionFilter, setEmotionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest") // newest, oldest, highest-score, lowest-score
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Modal Details State
  const [selectedItem, setSelectedItem] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      const response = await api.post("/api/feedback/user-feedback")
      if (response.data && response.data.success) {
        setFeedbacks(response.data.feedbacks || [])
      } else {
        toast.error("Failed to load feedbacks.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error retrieving histories from server.")
    } finally {
      setLoading(false)
    }
  }

  // Deletion logic connected to server
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback log? This cannot be undone.")) return
    
    setDeletingId(id)
    try {
      const response = await api.delete(`/api/feedback/${id}`)
      if (response.data && response.data.success) {
        toast.success("Feedback log deleted successfully!")
        setFeedbacks(prev => prev.filter(f => f.id !== id))
        if (selectedItem?.id === id) {
          setDetailsOpen(false)
        }
      } else {
        toast.error(response.data.message || "Failed to delete feedback.")
      }
    } catch (error) {
      toast.error("Error deleting feedback from database.")
    } finally {
      setDeletingId(null)
    }
  }

  // Details Modal Trigger
  const handleOpenDetails = (item) => {
    setSelectedItem(item)
    setDetailsOpen(true)
  }

  const handleCopy = () => {
    if (!selectedItem?.aiReply) return
    navigator.clipboard.writeText(selectedItem.aiReply)
    setCopied(true)
    toast.success("Draft copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!selectedItem) return
    const text = `SENTRAFLOW SUPPORT RESOLUTION REPORT\n=====================================\nTitle: ${selectedItem.title}\nDate: ${new Date(selectedItem.createdAt).toLocaleString()}\nSentiment Score: ${selectedItem.emotionScore}/100\nEmotion Class: ${selectedItem.emotion || "Neutral"}\nStatus: Resolved\n\nORIGINAL TICKET:\n----------------\n${selectedItem.content}\n\nAI DRAFT RESOLUTION REPLY:\n--------------------------\n${selectedItem.aiReply || "No reply generated."}\n`
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Resolution-${selectedItem.title.replace(/\s+/g, "_")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Downloaded report!")
  }

  // Renders **bold** markdown tokens as <strong> elements
  const renderFormattedText = (text) => {
    if (!text) return null
    const paragraphs = text.split(/\n\n+/)
    return paragraphs.map((para, pIdx) => {
      const lines = para.split("\n")
      return (
        <p key={pIdx} className="mb-2 last:mb-0 leading-relaxed text-xs">
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

  // Filter & Search & Sort operations
  const filteredFeedbacks = feedbacks
    .filter((f) => {
      const matchesSearch = 
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.content.toLowerCase().includes(searchQuery.toLowerCase())
      
      const emo = f.emotion ? f.emotion.toLowerCase() : "neutral"
      const matchesEmotion = emotionFilter === "all" || emo === emotionFilter.toLowerCase()
      
      const s = f.status ? f.status.toLowerCase() : "pending"
      const matchesStatus = statusFilter === "all" || s === statusFilter.toLowerCase()

      return matchesSearch && matchesEmotion && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === "highest-score") return b.emotionScore - a.emotionScore
      if (sortBy === "lowest-score") return a.emotionScore - b.emotionScore
      return 0
    })

  // Pagination calculation
  const totalItems = filteredFeedbacks.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(() => {
    // Reset page index if filters reduce rows below current page boundary
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  // Helpers for badges
  const getEmotionBadge = (emotion, score) => {
    const emo = emotion ? emotion.toLowerCase() : "neutral"
    if (emo === "happy" || score < 30) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/45 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <Smile className="h-3.5 w-3.5" /> Happy
        </span>
      )
    }
    if (emo === "neutral" || (score >= 30 && score <= 60)) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/45 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
          <Meh className="h-3.5 w-3.5" /> Neutral
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950/45 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
        <Frown className="h-3.5 w-3.5" /> {emotion || "Negative"}
      </span>
    )
  }

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "pending"
    if (s === "resolved") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/35 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="h-3 w-3" /> Resolved
        </span>
      )
    }
    if (s === "failed") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950/35 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200/10">
          <Clock className="h-3 w-3" /> Failed
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/35 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-200/10">
        <Clock className="h-3 w-3" /> Pending
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold font-display tracking-tight">Feedback History</h2>
        <p className="text-muted-foreground text-sm">Browse, filter, and audit past customer resolutions.</p>
      </div>

      {/* Filter and search toolbar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          {/* Search bar */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search title or content text..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Filter Sentiment */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <select
                className="bg-card border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
                value={emotionFilter}
                onChange={(e) => setEmotionFilter(e.target.value)}
              >
                <option value="all">All Sentiments</option>
                <option value="happy">Happy</option>
                <option value="neutral">Neutral</option>
                <option value="angry">Angry</option>
                <option value="frustrated">Frustrated</option>
                <option value="sad">Sad</option>
              </select>
            </div>

            {/* Filter Status */}
            <select
              className="bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="resolved">Resolved</option>
              <option value="pending">Pending</option>
            </select>

            {/* Sort Options */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <select
                className="bg-card border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest-score">Score (High-Low)</option>
                <option value="lowest-score">Score (Low-High)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table view */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center animate-pulse">
                  <div className="h-5 w-48 bg-muted rounded" />
                  <div className="h-5 w-16 bg-muted rounded" />
                  <div className="h-5 w-12 bg-muted rounded" />
                  <div className="h-8 w-24 bg-muted rounded-lg" />
                </div>
              ))}
            </div>
          ) : currentItems.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm">
              No matching records found. Try modifying your search query or filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 border-b border-border/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Sentiment</th>
                    <th className="px-6 py-4 text-center">Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {currentItems.map((f) => (
                    <tr key={f.id} className="hover:bg-muted/15 transition-colors">
                      <td className="px-6 py-4 font-semibold max-w-[200px] truncate">{f.title}</td>
                      <td className="px-6 py-4">{getEmotionBadge(f.emotion, f.emotionScore)}</td>
                      <td className="px-6 py-4 text-center font-bold">{f.emotionScore}</td>
                      <td className="px-6 py-4">{getStatusBadge(f.status)}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs font-medium">
                        {new Date(f.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-primary border-primary/20 hover:bg-primary/10"
                            onClick={() => handleOpenDetails(f)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/10"
                            onClick={() => handleDelete(f.id)}
                            disabled={deletingId === f.id}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{indexOfFirstItem + 1}</strong> to <strong className="text-foreground">{Math.min(indexOfLastItem, totalItems)}</strong> of <strong className="text-foreground">{totalItems}</strong> entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-xs font-semibold text-muted-foreground">Page {currentPage} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* View Details Dialog Overlay */}
      <Dialog isOpen={detailsOpen} onClose={() => setDetailsOpen(false)}>
        {selectedItem && (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center justify-between">
                <span className="truncate">{selectedItem.title}</span>
                {getStatusBadge(selectedItem.status)}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Log generated on {new Date(selectedItem.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {/* Telemetry metadata */}
              <div className="grid grid-cols-2 gap-4 bg-muted/40 border border-border/50 rounded-xl p-3 text-xs font-semibold">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">Sentiment Category</span>
                  <div className="capitalize text-foreground flex items-center gap-1">
                    {getEmotionBadge(selectedItem.emotion, selectedItem.emotionScore)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">Sentiment Score</span>
                  <span className="text-foreground font-bold">{selectedItem.emotionScore} / 100</span>
                </div>
              </div>

              {/* Ingested Content */}
              <div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Customer Input</span>
                <p className="text-xs bg-muted/20 border border-border/40 p-3 rounded-lg leading-relaxed text-foreground max-h-[120px] overflow-y-auto italic">
                  "{selectedItem.content}"
                </p>
              </div>

              {/* Draft Resolution Output */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">AI Draft Reply</span>
                  <div className="flex gap-1.5">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => window.print()} title="Print">
                      <Printer className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDownload} title="Download Report">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy} title="Copy Draft">
                      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <div className="w-full min-h-[160px] max-h-[260px] overflow-y-auto text-xs leading-relaxed border p-3 bg-muted/10 border-border/50 rounded-lg text-foreground font-sans font-medium select-text">
                  {renderFormattedText(selectedItem.aiReply || "Status is pending. Check back once the background worker finishes computing this item.")}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" size="sm" onClick={() => setDetailsOpen(false)}>Close</Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDelete(selectedItem.id)}
                disabled={deletingId === selectedItem.id}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Record
              </Button>
            </DialogFooter>
          </div>
        )}
      </Dialog>
    </div>
  )
}
