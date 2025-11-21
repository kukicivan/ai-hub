import { useState, type ChangeEvent } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmailResponder from "@/components/ui/EmailResponder";
import { emailApi, type EmailMessage } from "@/redux/features/email/emailApi";
import type { TResponse } from "@/types/global.types";

function isEmailResponse(data: unknown): data is TResponse<EmailMessage[]> {
  return !!data && typeof data === "object" && "data" in data;
}

export default function InboxV2() {
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<EmailMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "important" | "analyzed">("all");
  const { data, isLoading, error: apiError } = emailApi.useGetMessagesQuery();
  const [analyzeEmail] = emailApi.useAnalyzeEmailMutation();

  // Ensure messages is always an array
  const messages: EmailMessage[] = isEmailResponse(data)
    ? (data.data ?? [])
    : Array.isArray(data)
      ? data
      : [];

  const handleAnalyzeEmail = async (messageId: string) => {
    try {
      await analyzeEmail(messageId);
    } catch (error) {
      console.error("Failed to analyze email:", error);
    }
  };

  const filtered: EmailMessage[] = messages.filter((m: EmailMessage) => {
    // Apply search filter
    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      const matchesSearch =
        (m.subject?.toLowerCase() || "").includes(s) ||
        (m.from?.toLowerCase() || "").includes(s) ||
        (m.content?.toLowerCase() || "").includes(s);
      if (!matchesSearch) return false;
    }

    // Apply category filter
    if (filter === "unread" && !m.unread) return false;
    if (filter === "important" && !m.important) return false;
    if (filter === "analyzed" && !m.aiAnalysis) return false;

    return true;
  });

  // Calculate statistics
  const totalMessages = messages.length;
  const unreadCount = messages.filter((m) => m.unread).length;
  const importantCount = messages.filter((m) => m.important).length;
  const analyzedCount = messages.filter((m) => m.aiAnalysis).length;

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header Section */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Inbox v2</h1>
              <p className="text-muted-foreground mt-1">Fetching real messages from Laravel API</p>
            </div>
            <Button
              onClick={() => {
                setSelected(null);
                setSearch("");
                setFilter("all");
              }}
            >
              🔄 Refresh
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{totalMessages}</div>
                  <div className="text-sm text-muted-foreground mt-1">Total Messages</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{unreadCount}</div>
                  <div className="text-sm text-muted-foreground mt-1">Unread</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">{importantCount}</div>
                  <div className="text-sm text-muted-foreground mt-1">Important</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{analyzedCount}</div>
                  <div className="text-sm text-muted-foreground mt-1">AI Analyzed</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="🔍 Search messages..."
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="max-w-md"
              />
              {search && (
                <Button variant="ghost" size="sm" onClick={() => setSearch("")} className="h-10">
                  ✕ Clear
                </Button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Filter:</span>
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className={`h-8 ${filter === "all" ? "" : "hover:bg-muted"}`}
              >
                All ({totalMessages})
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
                className={`h-8 ${filter === "unread" ? "" : "hover:bg-blue-50"}`}
              >
                📬 Unread ({unreadCount})
              </Button>
              <Button
                variant={filter === "important" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("important")}
                className={`h-8 ${filter === "important" ? "" : "hover:bg-amber-50"}`}
              >
                ⭐ Important ({importantCount})
              </Button>
              <Button
                variant={filter === "analyzed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("analyzed")}
                className={`h-8 ${filter === "analyzed" ? "" : "hover:bg-green-50"}`}
              >
                🤖 Analyzed ({analyzedCount})
              </Button>
              {filter !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="h-8 text-xs text-muted-foreground"
                >
                  ✕ Clear filter
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-sm text-muted-foreground">Loading messages...</span>
            </div>
          )}

          {apiError && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="text-sm text-destructive font-medium">
                ⚠️ Error: {/* @ts-expect-error -- apiError may be unknown shape from RTK query */}
                {apiError?.data?.message || "Failed to load messages"}
              </div>
            </div>
          )}

          {/* Results Counter */}
          {!isLoading && filtered.length > 0 && (
            <div className="flex items-center justify-between text-sm bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                  {filtered.length === 1 ? "message" : "messages"}
                  {filtered.length !== totalMessages && (
                    <span className="text-muted-foreground"> of {totalMessages} total</span>
                  )}
                </span>
                {(search || filter !== "all") && (
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    {search && filter !== "all"
                      ? `Filtered & Searched`
                      : search
                        ? "Searched"
                        : "Filtered"}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {filtered.length === 0 && !isLoading && messages.length > 0 && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🔍</div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No messages found</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {search && filter !== "all"
                        ? `No results for "${search}" in ${filter} messages`
                        : search
                          ? `No results matching "${search}"`
                          : `No ${filter} messages available`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Showing 0 of {totalMessages} total messages
                    </p>
                    {(search || filter !== "all") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => {
                          setSearch("");
                          setFilter("all");
                        }}
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {messages.length === 0 && !isLoading && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <div className="text-4xl mb-3">📭</div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No messages yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Your inbox is empty. Messages will appear here when they arrive.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {filtered.map((m: EmailMessage) => (
              <Card key={m.id}>
                <CardHeader className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{m.from}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(m.date).toLocaleString()}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Sender & Subject Header */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-foreground">{m.from}</span>
                          {m.unread && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              New
                            </span>
                          )}
                          {m.important && <span className="text-red-500">⭐</span>}
                          {m.hasAttachments && <span className="text-muted-foreground">📎</span>}
                        </div>

                        {/* Title Section */}
                        <div className="mb-3">
                          <div className="text-xs text-muted-foreground mb-1">Title:</div>
                          <div className="font-semibold text-foreground">{m.subject}</div>
                        </div>

                        {/* Message Preview */}
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Message:</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {m.content}
                          </div>
                        </div>

                        {/* Priority Badge */}
                        {m.priority === "high" && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                              HIGH PRIORITY
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button size="sm" onClick={() => setSelected(m)}>
                          Reply
                        </Button>
                      </div>
                    </div>

                    {m.aiAnalysis ? (
                      <div className="bg-green-50 p-4 rounded-lg space-y-3 border border-green-200">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-green-700">🤖 AI Analysis Results</span>
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                            {m.aiAnalysis.sentiment}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                            {m.aiAnalysis.priority} priority
                          </span>
                        </div>

                        {/* Summary Section */}
                        <div className="text-sm">
                          <div className="font-medium text-green-700 mb-1">Summary:</div>
                          <p className="text-green-600">{m.aiAnalysis.summary}</p>
                        </div>

                        {/* Action Items */}
                        {m.aiAnalysis.actionItems.length > 0 && (
                          <div className="space-y-1">
                            <div className="font-medium text-green-700">Suggested Actions:</div>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {m.aiAnalysis.actionItems.map((item: string, i: number) => (
                                <li key={i} className="text-green-600">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Confidence & Model Info */}
                        <div className="flex items-center gap-4 text-xs text-green-600 pt-2 border-t border-green-200">
                          <span>✓ Analysis Complete</span>
                          {m.aiAnalysis.confidence && (
                            <span>Confidence: {Math.round(m.aiAnalysis.confidence * 100)}%</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mb-4"
                        onClick={() => handleAnalyzeEmail(m.id)}
                      >
                        Analyze with AI
                      </Button>
                    )}

                    {/* Email Management Section - Enhanced */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="space-y-4">
                        {/* Action Buttons Grid */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* Primary Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelected(m)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-1"
                            >
                              📧 Reply
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex-1"
                            >
                              📋 Forward
                            </Button>
                          </div>

                          {/* Secondary Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 flex-1"
                            >
                              🏷️ Label
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 flex-1"
                            >
                              {m.important ? "⭐ Unmark" : "⭐ Important"}
                            </Button>
                          </div>
                        </div>

                        {/* Additional Quick Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button variant="ghost" size="sm" className="text-xs h-8">
                            📁 Archive
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs h-8">
                            🗑️ Delete
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs h-8">
                            ✉️ Mark {m.unread ? "Read" : "Unread"}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs h-8">
                            🔔 Snooze
                          </Button>
                        </div>

                        {/* Reply Form (Collapsible) */}
                        {selected && m.id === selected.id && (
                          <div className="bg-muted/50 p-4 rounded-lg border border-border">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-medium text-sm">Compose Reply</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelected(null)}
                                className="h-6 px-2 text-xs"
                              >
                                ✕ Close
                              </Button>
                            </div>
                            <EmailResponder
                              initialFrom={selected.from}
                              initialSubject={`Re: ${selected.subject}`}
                              apiUrl="/api/email/respond"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Email Responder (when no specific message is selected) */}
          {selected && !messages.find((m) => m.id === selected.id) && (
            <div className="mt-6">
              <h2 className="text-lg">Reply to {selected.from}</h2>
              <EmailResponder
                initialFrom={selected.from}
                initialSubject={`Re: ${selected.subject}`}
                apiUrl="/api/email/respond"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
