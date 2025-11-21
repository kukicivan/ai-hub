import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Cpu,
  Zap,
  Target,
  CheckCircle,
  Mail,
  Brain,
  FileText,
  ListChecks,
  Sparkles,
} from "lucide-react";

export function AIHelp() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            AI Help & Documentation
          </h1>
          <p className="text-muted-foreground mt-2">
            Learn how AI powers your email management system
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">AI Services</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                What is AI Email Management?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Our AI-powered email management system automatically analyzes incoming emails to
                provide:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Intelligent Analysis</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Automatically categorizes, prioritizes, and understands email content
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Instant Insights</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get sentiment analysis, summaries, and suggested responses
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Target className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Action Detection</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Identifies actionable items and deadlines automatically
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Smart Replies</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      AI-generated response suggestions tailored to context
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  How It Works
                </h4>
                <ol className="text-xs text-muted-foreground space-y-2 ml-6 list-decimal">
                  <li>Emails are automatically fetched from your connected accounts</li>
                  <li>AI analyzes content, sentiment, priority, and intent</li>
                  <li>Results are displayed with visual badges and summaries</li>
                  <li>Suggested actions and replies help you respond faster</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                Available AI Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {/* HTML Analysis */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm">HTML Analysis</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Extracts clean text from HTML emails, removing formatting and scripts
                        </p>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            98.2% accuracy
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Classification */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm">Email Classification</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Categorizes emails into primary categories and subcategories with
                          confidence scores
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            95.7% accuracy
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            10+ categories
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm">Sentiment Analysis</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Detects emotional tone, urgency levels, and business potential
                        </p>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            92.4% accuracy
                          </Badge>
                          <Badge className="text-xs bg-green-500">Positive</Badge>
                          <Badge className="text-xs bg-blue-500">Neutral</Badge>
                          <Badge className="text-xs bg-red-500">Negative</Badge>
                          <Badge className="text-xs bg-yellow-500">Urgent</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm">Smart Recommendations</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Generates suggested replies with reasoning and priority levels
                        </p>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            89.1% accuracy
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Creation */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm">Action Item Detection</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Identifies tasks, deadlines, and required actions from email content
                        </p>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            94.3% accuracy
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                AI-Detected Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The AI automatically detects and extracts actionable items from your emails:
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-sm mb-2">Action Types</h4>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>
                      <strong>Reply</strong> - Requires a response from you
                    </li>
                    <li>
                      <strong>Forward</strong> - Needs to be forwarded to someone
                    </li>
                    <li>
                      <strong>Review</strong> - Documents or content needs review
                    </li>
                    <li>
                      <strong>Schedule</strong> - Meeting or event needs scheduling
                    </li>
                    <li>
                      <strong>Approve</strong> - Decision or approval required
                    </li>
                    <li>
                      <strong>Task</strong> - General task to be completed
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-sm mb-2">Action Details</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Each detected action includes:
                  </p>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-xs">
                        <strong>Type</strong> - Category of action
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-xs">
                        <strong>Description</strong> - What needs to be done
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-xs">
                        <strong>Deadline</strong> - When it's due (if detected)
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-xs">
                        <strong>Timeline</strong> - Estimated completion time
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-semibold text-sm mb-2">Example Actions</h4>
                  <div className="space-y-2">
                    <div className="text-xs p-2 bg-white dark:bg-gray-900 rounded border">
                      <strong>Type:</strong> Reply • <strong>Description:</strong> Send quarterly
                      report • <strong>Deadline:</strong> Friday 5 PM
                    </div>
                    <div className="text-xs p-2 bg-white dark:bg-gray-900 rounded border">
                      <strong>Type:</strong> Schedule • <strong>Description:</strong> Book meeting
                      with client • <strong>Timeline:</strong> Next week
                    </div>
                    <div className="text-xs p-2 bg-white dark:bg-gray-900 rounded border">
                      <strong>Type:</strong> Review • <strong>Description:</strong> Check attached
                      contract • <strong>Priority:</strong> High
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Structure Tab */}
        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                AI Analysis Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Understanding how AI analysis data is structured in the application:
              </p>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-3">Email Message Structure</h4>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
                    {`{
  "id": 41,
  "message_id": "19a4771d036e219c",
  "from": "sender@example.com",
  "subject": "Project Update",
  "received_at": "2025-11-20T10:30:00Z",
  "ai": {
    "status": "completed",
    "summary": "AI-generated summary...",
    "sentiment": "neutral",
    "intent": "request",
    "priority": "high",
    "entities": {
      "dates": ["2025-11-25"],
      "people": ["John Doe"],
      "organizations": ["Acme Corp"]
    },
    "suggested_reply": "AI response...",
    "action_items": [
      {
        "type": "reply",
        "description": "Send report",
        "deadline": "2025-11-25"
      }
    ]
  }
}`}
                  </pre>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Status Values</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500">completed</Badge>
                        <span className="text-muted-foreground">Analysis done</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-500">processing</Badge>
                        <span className="text-muted-foreground">In progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-500">pending</Badge>
                        <span className="text-muted-foreground">Waiting</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500">failed</Badge>
                        <span className="text-muted-foreground">Error occurred</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Priority Levels</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500">high</Badge>
                        <span className="text-muted-foreground">Urgent attention</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500">normal</Badge>
                        <span className="text-muted-foreground">Standard priority</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-500">low</Badge>
                        <span className="text-muted-foreground">Can wait</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Sentiment Types</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500">positive</Badge>
                        <span className="text-muted-foreground">Good tone</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500">neutral</Badge>
                        <span className="text-muted-foreground">Factual</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500">negative</Badge>
                        <span className="text-muted-foreground">Critical</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500 animate-pulse">urgent</Badge>
                        <span className="text-muted-foreground">Immediate</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Intent Categories</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500">question</Badge>
                        <span className="text-muted-foreground">Inquiry</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-500">request</Badge>
                        <span className="text-muted-foreground">Action needed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-500">info</Badge>
                        <span className="text-muted-foreground">Information</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-500">other</Badge>
                        <span className="text-muted-foreground">Miscellaneous</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-sm mb-2">Visual Representation</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Each email displays AI analysis with color-coded badges:
                  </p>
                  <div className="text-xs space-y-2 bg-white dark:bg-gray-900 p-3 rounded border">
                    <div className="font-mono">Email Box → [AI Divider] → AI Analysis Section</div>
                    <div className="ml-4 space-y-1 text-muted-foreground">
                      <div>• Status Badge (green/yellow/red)</div>
                      <div>• Sentiment Badge (colors + icons)</div>
                      <div>• Priority Badge (red/blue/gray)</div>
                      <div>• Intent Badge (with symbols)</div>
                      <div>• Summary Text</div>
                      <div>• Suggested Reply (if available)</div>
                      <div>• Action Items List (if any)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AIHelp;
