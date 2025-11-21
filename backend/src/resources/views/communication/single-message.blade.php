<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $message['subject'] ?? 'AI Message Analysis' }} - Unified Messaging System</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        body {
            font-family: 'Inter', sans-serif;
        }

        .priority-badge {
            @apply px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider;
        }

        .priority-high {
            @apply bg-red-100 text-red-800 border border-red-300;
        }

        .priority-medium {
            @apply bg-yellow-100 text-yellow-800 border border-yellow-300;
        }

        .priority-low {
            @apply bg-gray-100 text-gray-800 border border-gray-300;
        }

        .score-badge {
            @apply inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold;
        }

        .score-high {
            @apply bg-green-500 text-white;
        }

        .score-medium {
            @apply bg-yellow-500 text-white;
        }

        .score-low {
            @apply bg-gray-400 text-white;
        }

        .action-step {
            @apply flex items-start gap-2 p-3 bg-blue-50 rounded-md text-sm mb-2;
        }
    </style>
</head>
<body class="bg-gray-50">
<div class="min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">
                        <i class="fas fa-envelope-open-text text-purple-600 mr-2"></i>
                        AI Message Analysis
                    </h1>
                    <p class="text-sm text-gray-600 mt-1">
                        <i class="far fa-calendar mr-1"></i>
                        {{ \Carbon\Carbon::now()->setTimezone(env('USER_TIMEZONE', 'UTC'))->isoFormat('dddd, D. MMMM YYYY') }}
                    </p>
                </div>

                <div class="flex items-center gap-3">
                    @if($message)
                        <a href="{{ url()->current() }}?reprocess=1"
                           class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                            <i class="fas fa-sync-alt mr-2"></i>
                            Reprocess
                        </a>
                    @endif
                    <a href="/api/communication/ai-dashboard"
                       class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Back to Dashboard
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @if($error)
            <!-- Error Message -->
            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                <div class="flex items-start gap-3">
                    <i class="fas fa-exclamation-circle text-red-600 text-3xl"></i>
                    <div>
                        <h3 class="text-lg font-bold text-red-900 mb-2">Error</h3>
                        <p class="text-sm text-red-700">{{ $error }}</p>
                    </div>
                </div>
            </div>
        @elseif($message)
            <!-- Message Card -->
            <div class="bg-white rounded-lg shadow-lg border-l-4 border-{{ $message['priority_level'] === 'high' ? 'red' : ($message['priority_level'] === 'medium' ? 'yellow' : 'gray') }}-500">
                <!-- Header -->
                <div class="p-8 border-b border-gray-200">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-3">
                                <span class="priority-badge priority-{{ $message['priority_level'] }}">
                                    {{ $message['priority_level'] }}
                                </span>
                                @if($message['is_unread'])
                                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        <i class="fas fa-circle text-blue-600 text-xs mr-1"></i>
                                        Unread
                                    </span>
                                @endif
                                @if($message['ai_status'])
                                    <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                        <i class="fas fa-check-circle text-green-600 text-xs mr-1"></i>
                                        {{ ucfirst($message['ai_status']) }}
                                    </span>
                                @endif
                            </div>
                            <h2 class="text-3xl font-bold text-gray-900 mb-3">
                                {{ $message['subject'] }}
                            </h2>
                            <div class="flex items-center gap-4 text-sm text-gray-600">
                                <div>
                                    <i class="far fa-user mr-1"></i>
                                    <span class="font-semibold">{{ $message['sender'] }}</span>
                                    @if($message['sender_email'])
                                        <span class="text-gray-500">&lt;{{ $message['sender_email'] }}&gt;</span>
                                    @endif
                                </div>
                                <div>
                                    <i class="far fa-clock mr-1"></i>{{ $message['timestamp'] }}
                                </div>
                            </div>
                        </div>
                        @if($message['gmail_link'] && $message['gmail_link'] !== '#')
                            <a href="{{ $message['gmail_link'] }}" target="_blank"
                               class="text-purple-600 hover:text-purple-800 transition-colors ml-4">
                                <i class="fas fa-external-link-alt text-2xl"></i>
                            </a>
                        @endif
                    </div>

                    <!-- Scores -->
                    <div class="flex items-center gap-6 pt-4">
                        <div class="flex items-center gap-2">
                            <span class="score-badge {{ $message['business_potential'] >= 7 ? 'score-high' : ($message['business_potential'] >= 4 ? 'score-medium' : 'score-low') }}">
                                {{ $message['business_potential'] }}
                            </span>
                            <div>
                                <div class="text-xs text-gray-500">Business Potential</div>
                                <div class="text-sm font-semibold text-gray-700">
                                    {{ $message['business_potential'] >= 7 ? 'High' : ($message['business_potential'] >= 4 ? 'Medium' : 'Low') }}
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="score-badge {{ $message['urgency_score'] >= 7 ? 'score-high' : ($message['urgency_score'] >= 4 ? 'score-medium' : 'score-low') }}">
                                {{ $message['urgency_score'] }}
                            </span>
                            <div>
                                <div class="text-xs text-gray-500">Urgency Score</div>
                                <div class="text-sm font-semibold text-gray-700">
                                    {{ $message['urgency_score'] >= 7 ? 'High' : ($message['urgency_score'] >= 4 ? 'Medium' : 'Low') }}
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="score-badge {{ $message['automation_relevance'] >= 7 ? 'score-high' : ($message['automation_relevance'] >= 4 ? 'score-medium' : 'score-low') }}">
                                {{ $message['automation_relevance'] }}
                            </span>
                            <div>
                                <div class="text-xs text-gray-500">Automation Relevance</div>
                                <div class="text-sm font-semibold text-gray-700">
                                    {{ $message['automation_relevance'] >= 7 ? 'High' : ($message['automation_relevance'] >= 4 ? 'Medium' : 'Low') }}
                                </div>
                            </div>
                        </div>
                        @if($message['has_attachments'])
                            <div class="ml-auto">
                                <span class="bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-sm">
                                    <i class="fas fa-paperclip mr-1"></i>{{ $message['attachment_count'] }} Attachment{{ $message['attachment_count'] > 1 ? 's' : '' }}
                                </span>
                            </div>
                        @endif
                    </div>
                </div>

                <!-- Summary -->
                @if($message['summary'])
                    <div class="p-8 border-b border-gray-200 bg-gray-50">
                        <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center">
                            <i class="fas fa-file-alt text-blue-600 mr-2"></i>
                            Summary
                        </h3>
                        <p class="text-gray-700 leading-relaxed">
                            {{ $message['summary'] }}
                        </p>
                    </div>
                @endif

                <!-- AI Recommendation -->
                @if($message['recommendation'])
                    <div class="p-8 border-b border-gray-200 bg-purple-50">
                        <div class="flex items-start gap-3">
                            <i class="fas fa-robot text-purple-600 text-2xl mt-1"></i>
                            <div class="flex-1">
                                <h3 class="text-lg font-bold text-purple-900 mb-2">
                                    AI Recommendation
                                </h3>
                                <p class="text-purple-800 leading-relaxed">
                                    {{ $message['recommendation'] }}
                                </p>
                            </div>
                        </div>
                    </div>
                @endif

                <!-- Action Steps -->
                @if(!empty($message['action_steps']))
                    <div class="p-8 border-b border-gray-200">
                        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <i class="fas fa-tasks text-blue-600 mr-2"></i>
                            Action Steps
                        </h3>
                        <div class="space-y-2">
                            @foreach($message['action_steps'] as $index => $step)
                                <div class="action-step">
                                    <div class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        {{ $index + 1 }}
                                    </div>
                                    <span class="flex-1 text-gray-800">{{ $step }}</span>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif

                <!-- Message Content -->
                @if($message['content_text'])
                    <div class="p-8 border-b border-gray-200">
                        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <i class="far fa-envelope text-gray-600 mr-2"></i>
                            Message Content
                        </h3>
                        <div class="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                            {{ $message['content_text'] }}
                        </div>
                    </div>
                @endif

                <!-- Metadata Footer -->
                <div class="p-8 bg-gray-50">
                    <div class="flex items-center justify-between text-sm">
                        <div class="flex items-center gap-4">
                            <span class="bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
                                <i class="far fa-folder mr-1"></i>
                                {{ ucfirst(str_replace('_', ' ', $message['category'])) }}
                            </span>
                            <span class="text-gray-600">
                                <i class="far fa-clock mr-1"></i>
                                Timeline: {{ ucfirst(str_replace('_', ' ', $message['timeline'])) }}
                            </span>
                        </div>
                        <div class="text-gray-500 text-xs">
                            Message ID: {{ $message['message_id'] }}
                        </div>
                    </div>
                </div>
            </div>
        @else
            <div class="text-center py-12">
                <div class="text-gray-400 mb-4">
                    <i class="fas fa-inbox text-6xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">No Message Found</h3>
                <p class="text-gray-500">The requested message could not be found.</p>
            </div>
        @endif
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600">
                    <i class="fas fa-robot mr-2 text-purple-600"></i>
                    Powered by AI • Unified Messaging System
                </div>
                <div class="text-sm text-gray-600">
                    {{ \Carbon\Carbon::now()->setTimezone(env('USER_TIMEZONE', 'UTC'))->format('H:i') }}
                </div>
            </div>
        </div>
    </footer>
</div>
</body>
</html>
