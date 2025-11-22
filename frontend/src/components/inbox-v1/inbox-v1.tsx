import React, { useState, useEffect } from "react";
import { useMessages } from "@/hooks/useMessages";
import { EmailMessage } from "@/redux/features/email/emailApi";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectSelectedMessageId, setSelectedMessageId } from "@/redux/features/inbox/inboxSlice";
import AIBadge from "../ui/AIBadge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, ArrowLeft, Clock, Bookmark, CheckSquare } from "lucide-react";
import EmailResponder from "../ui/EmailResponder";
import { MessageListSkeleton } from "../ui/InboxSkeleton";
import { useCreateTodoFromEmailMutation } from "@/redux/features/todo/todoApi";
import { toast } from "sonner";

// Use EmailMessage type from emailApi
type Message = EmailMessage;

export const InboxV1: React.FC = () => {
  const dispatch = useAppDispatch();
  const persistedMessageId = useAppSelector(selectSelectedMessageId);
  const { messages, loading, error, meta, fetchMessages } = useMessages({}, "v5");
  const [createTodoFromEmail] = useCreateTodoFromEmailMutation();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "unread" | "important" | "analyzed">("all");
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);

  // Auto-select a message on load - restore from Redux or select first
  useEffect(() => {
    if (messages.length > 0 && !selectedMessage) {
      // Try to restore a persisted message from Redux
      if (persistedMessageId) {
        const persistedMessage = messages.find((m) => m.id === persistedMessageId);
        if (persistedMessage) {
          setSelectedMessage(persistedMessage);
          return;
        }
      }
      // Otherwise select first message
      setSelectedMessage(messages[0]);
    }
  }, [messages, selectedMessage, persistedMessageId]);

  // Persist selected message ID to Redux when selection changes
  useEffect(() => {
    dispatch(setSelectedMessageId(selectedMessage?.id ?? null));
  }, [selectedMessage, dispatch]);

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = String(date.getDate()).padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} ${hours}:${minutes}h`;
  };

  const getPriorityLevel = (msg: Message): "high" | "normal" | "low" => {
    const level = msg.recommendation?.priority_level || msg.priority;
    if (level === "high" || level === "normal" || level === "low") return level;
    return "normal";
  };

  // Apply filters to messages
  const filteredMessages = messages.filter((msg) => {
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        msg.subject?.toLowerCase().includes(searchLower) ||
        msg.sender?.toLowerCase().includes(searchLower) ||
        msg.summary?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filter === "unread" && !msg.unread) return false;
    if (filter === "important" && !msg.important) return false;
    if (filter === "analyzed" && msg.ai_status !== "completed") return false;

    return true;
  });

  // Calculate statistics
  const totalMessages = messages.length;
  const unreadCount = messages.filter((m) => m.unread).length;
  const importantCount = messages.filter((m) => m.important).length;
  const analyzedCount = messages.filter((m) => m.ai_status === "completed").length;

  // Action handlers
  const handleReply = () => {
    if (selectedMessage) {
      setShowReplyForm(!showReplyForm);
    }
  };

  const handleSchedule = () => {
    if (selectedMessage) {
      console.log("Schedule email:", selectedMessage.id);
    }
  };

  const handleSnooze = () => {
    if (selectedMessage) {
      console.log("Snooze email:", selectedMessage.id);
    }
  };

  const handleAddToTodo = async () => {
    if (selectedMessage) {
      try {
        await createTodoFromEmail({
          email_id: Number(selectedMessage.id),
          title: selectedMessage.subject || "Zadatak iz emaila",
          priority:
            (selectedMessage.recommendation?.priority_level as "low" | "normal" | "high") ||
            "normal",
        }).unwrap();
        toast.success("Zadatak uspešno dodat!");
      } catch (err) {
        toast.error("Greška pri dodavanju zadatka");
        console.error("Greška pri dodavanju u TODO:", err);
      }
    }
  };

  const handleMarkAsDone = () => {
    if (selectedMessage) {
      console.log("Mark email as done:", selectedMessage.id);
    }
  };

  const renderAIAnalysis = (message: Message) => {
    if (message.ai_status !== "completed") {
      return (
        <div className="ai-loading p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center gap-2">
          <div className="animate-spin h-5 w-5 border-3 border-blue-500 rounded-full border-t-transparent"></div>
          <span className="text-blue-700 font-medium">AI analiza u toku...</span>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Sentiment Analysis */}
        {message.sentiment && (
          <div className="grid grid-cols-2 gap-3 text-sm bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-gray-700">
              <span className="font-medium text-gray-600">Sentiment Tone:</span>{" "}
              <span className="capitalize">{message.sentiment.tone}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-medium text-gray-600">Urgency Score:</span>{" "}
              <span className="font-semibold">{message.sentiment.urgency_score}/10</span>
            </div>
            <div className="text-gray-700">
              <span className="font-medium text-gray-600">Business Potential:</span>{" "}
              <span className="font-semibold">{message.sentiment.business_potential}/10</span>
            </div>
            <div className="text-gray-700">
              <span className="font-medium text-gray-600">Priority:</span>{" "}
              <AIBadge type="priority" value={getPriorityLevel(message)} />
            </div>
          </div>
        )}

        {/* Summary */}
        {message.summary && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <strong className="text-gray-900 block mb-2">📝 Sažetak:</strong>
            <p className="text-gray-700 text-sm leading-relaxed">{message.summary}</p>
          </div>
        )}

        {/* Cleaned Text from HTML Analysis */}
        {message.html_analysis?.cleaned_text && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <strong className="text-gray-900 block mb-2">📄 Sadržaj:</strong>
            <p className="text-gray-700 text-sm leading-relaxed">
              {message.html_analysis.cleaned_text}
            </p>
            {message.html_analysis.is_newsletter && (
              <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Newsletter
              </span>
            )}
          </div>
        )}

        {/* AI Analysis Metadata */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-gray-600 font-medium block mb-1">Confidence:</span>
              <span
                className={`font-semibold ${
                  (message.classification?.confidence_score ?? 0) >= 0.8
                    ? "text-green-600"
                    : (message.classification?.confidence_score ?? 0) >= 0.5
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {Math.round((message.classification?.confidence_score ?? 0) * 100)}%
              </span>
            </div>
            <div>
              <span className="text-gray-600 font-medium block mb-1">Processed:</span>
              <span className="text-gray-900 text-xs">
                {formatDateTime(message.ai_processed_at)}
              </span>
            </div>
            <div>
              <span className="text-gray-600 font-medium block mb-1">Status:</span>
              <span className="text-green-600 font-semibold">✓ {message.ai_status}</span>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        {message.recommendation && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <strong className="text-gray-900 block mb-2">🧭 Preporuka:</strong>
            <p className="text-gray-700 text-sm leading-relaxed">{message.recommendation.text}</p>
            {message.recommendation.reasoning && (
              <p className="text-gray-500 text-xs leading-relaxed mt-2">
                {message.recommendation.reasoning}
              </p>
            )}
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-medium">ROI Estimate:</span>{" "}
              {message.recommendation.roi_estimate}
            </div>
          </div>
        )}

        {/* Action Steps */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <strong className="text-gray-900 block mb-2">✅ Akcije:</strong>
          {message.action_steps && message.action_steps.length > 0 ? (
            <ul className="space-y-2">
              {message.action_steps.map((action, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <span className="text-blue-500 font-bold">•</span>
                  <div className="flex-1">
                    <div className="font-medium">{action.type}</div>
                    {action.description && (
                      <div className="text-gray-600 text-xs mt-1">{action.description}</div>
                    )}
                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                      {action.timeline && <span>Timeline: {action.timeline}</span>}
                      {action.estimated_time !== null && (
                        <span>Est. time: {action.estimated_time} min</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">Nema akcija</p>
          )}
        </div>

        {/* Classification */}
        {message.classification && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <strong className="text-gray-900 block mb-2">🏷️ Klasifikacija:</strong>
            <div className="text-sm text-gray-700">
              <div>
                <span className="font-medium text-gray-600">Kategorija:</span>{" "}
                <span className="capitalize">{message.classification.primary_category}</span>
                {message.classification.subcategory && (
                  <>
                    <span className="text-gray-400"> / </span>
                    <span className="capitalize">{message.classification.subcategory}</span>
                  </>
                )}
              </div>
              {message.classification.matched_keywords &&
                message.classification.matched_keywords.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.classification.matched_keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Message List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Primljene poruke</h1>
          <p className="text-sm text-gray-500 mt-1">{meta?.total || 0} poruka</p>

          {/* Search and Filters */}
          <div className="mt-4 space-y-3">
            {/* Search Input */}
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Pretraži poruke..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              {search && (
                <Button variant="ghost" size="sm" onClick={() => setSearch("")} className="h-10">
                  ✕
                </Button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-gray-500">Filter:</span>
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="h-7 text-xs"
              >
                Sve ({totalMessages})
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
                className="h-7 text-xs"
              >
                Nepročitano ({unreadCount})
              </Button>
              <Button
                variant={filter === "important" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("important")}
                className="h-7 text-xs"
              >
                Važno ({importantCount})
              </Button>
              <Button
                variant={filter === "analyzed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("analyzed")}
                className="h-7 text-xs"
              >
                Analizirano ({analyzedCount})
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <MessageListSkeleton count={8} />
          ) : error ? (
            <div className="p-4 text-red-500 text-sm">{error}</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedMessage?.id === message.id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
                      {message.subject}
                    </h3>
                    <AIBadge type="priority" value={getPriorityLevel(message)} />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{message.sender}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{message.summary}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">
                      {formatDateTime(message.received_at)}
                    </span>
                    {message.ai_status === "completed" && (
                      <span className="text-xs text-green-600 font-medium">Analizirano</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Page {meta.page} of {meta.total_pages}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => fetchMessages({ page: meta.page - 1 })}
                  disabled={meta.page === 1}
                  className="px-3 py-1 text-xs bg-white border rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={() => fetchMessages({ page: meta.page + 1 })}
                  disabled={meta.page === meta.total_pages}
                  className="px-3 py-1 text-xs bg-white border rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Message Detail */}
      <div className="flex-1 overflow-y-auto">
        {selectedMessage ? (
          <div className="max-w-4xl mx-auto p-6">
            {/* Message Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-2xl font-bold text-gray-900 flex-1">
                  {selectedMessage.subject}
                </h2>

                {/* Action Dropdown Button */}
                <div className="flex items-center gap-0">
                  <Button
                    onClick={handleReply}
                    className="px-6 py-3 rounded-l-lg rounded-r-none bg-green-600 hover:bg-green-700 text-white font-semibold text-lg shadow-md transition-colors"
                  >
                    Odgovori
                  </Button>
                  <div className="w-px h-12 bg-green-500"></div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="px-3 py-3 rounded-r-lg rounded-l-none bg-green-600 hover:bg-green-700 text-white shadow-md transition-colors h-12">
                        <ChevronDown className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 rounded-lg p-3 bg-white shadow-lg">
                      <DropdownMenuItem
                        className="w-full rounded-md px-4 py-3 mb-2 flex items-center gap-3 bg-green-600 text-white cursor-pointer hover:bg-green-700"
                        onClick={handleReply}
                      >
                        <ArrowLeft className="h-5 w-5 text-white" />
                        <span className="text-base">Odgovori</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="w-full rounded-md px-4 py-3 mb-2 flex items-center gap-3 bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                        onClick={handleSchedule}
                      >
                        <Clock className="h-5 w-5 text-white" />
                        <span className="text-base">Zakaži</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="w-full rounded-md px-4 py-3 mb-2 flex items-center gap-3 bg-violet-600 text-white cursor-pointer hover:bg-violet-700"
                        onClick={handleSnooze}
                      >
                        <Clock className="h-5 w-5 text-white" />
                        <span className="text-base">Odloži</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="w-full rounded-md px-4 py-3 mb-2 flex items-center gap-3 bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600"
                        onClick={handleAddToTodo}
                      >
                        <Bookmark className="h-5 w-5 text-white" />
                        <span className="text-base">Dodaj u zadatke</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="w-full rounded-md px-4 py-3 flex items-center gap-3 bg-yellow-400 text-white cursor-pointer hover:bg-yellow-500"
                        onClick={handleMarkAsDone}
                      >
                        <CheckSquare className="h-5 w-5 text-white" />
                        <span className="text-base">Označi kao završeno</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Od:</span> {selectedMessage.sender}
                </div>
                <div>
                  <span className="font-medium">Datum:</span>{" "}
                  {formatDateTime(selectedMessage.received_at)}
                </div>
                <div>
                  <a
                    href={selectedMessage.gmail_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Otvori u Gmail-u
                  </a>
                </div>
              </div>
            </div>

            {/* Reply Form Section */}
            {showReplyForm && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-4 border-2 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ArrowLeft className="h-5 w-5 text-green-600" />
                    Napiši odgovor
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyForm(false)}
                    className="h-8 px-3 text-sm hover:bg-gray-100"
                  >
                    Zatvori
                  </Button>
                </div>
                {/* EmailResponder now uses RTK Query - apiUrl prop removed */}
                <EmailResponder
                  initialFrom={selectedMessage.sender}
                  initialSubject={`Re: ${selectedMessage.subject}`}
                />
              </div>
            )}

            {/* AI Analysis Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                AI Analiza
              </h3>
              {renderAIAnalysis(selectedMessage)}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium">Izaberite poruku za prikaz detalja</p>
              <p className="text-sm text-gray-400 mt-1">Odaberite iz liste sa leve strane</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxV1;
