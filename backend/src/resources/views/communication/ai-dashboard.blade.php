<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Email Dashboard - Unified Messaging System</title>
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
            @apply inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold;
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

        .message-card {
            @apply bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-200 border-l-4;
        }

        .message-card.high {
            @apply border-red-500;
        }

        .message-card.medium {
            @apply border-yellow-500;
        }

        .message-card.low {
            @apply border-gray-400;
        }

        .action-step {
            @apply flex items-start gap-2 p-3 bg-blue-50 rounded-md text-sm mb-2;
        }

        .animate-pulse-slow {
            animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
    </style>
</head>
<body class="bg-gray-50">
<div class="min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">
                        <i class="fas fa-brain text-purple-600 mr-2"></i>
                        AI Email Dashboard
                    </h1>
                    <p class="text-sm text-gray-600 mt-1">
                        <i class="far fa-calendar mr-1"></i>
                        {{ \Carbon\Carbon::now()->setTimezone(env('USER_TIMEZONE', 'UTC'))->isoFormat('dddd, D. MMMM YYYY') }}
                    </p>
                </div>

                <div class="flex items-center gap-4">
                    <!-- Stats -->
                    <div class="text-right">
                        <div class="text-sm text-gray-600">Obrađeno</div>
                        <div class="text-2xl font-bold text-green-600">
                            {{ $processedMessages }} / {{ $totalMessages }}
                        </div>
                        <div class="text-xs text-gray-500">
                            {{ $processingStats['success_rate'] }}% success rate
                        </div>
                    </div>

                    <!-- Reprocess Button -->
                    <a href="{{ url()->current() }}?days={{ $daysBack }}&reprocess=1"
                       class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        <i class="fas fa-sync-alt mr-2"></i>
                        Reprocess
                    </a>

                    <!-- Days Filter -->
                    <select onchange="window.location.href='?days='+this.value"
                            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500">
                        <option value="1" {{ $daysBack == 1 ? 'selected' : '' }}>Danas</option>
                        <option value="2" {{ $daysBack == 2 ? 'selected' : '' }}>2 dana</option>
                        <option value="3" {{ $daysBack == 3 ? 'selected' : '' }}>3 dana</option>
                        <option value="5" {{ $daysBack == 5 ? 'selected' : '' }}>5 dana</option>
                        <option value="7" {{ $daysBack == 7 ? 'selected' : '' }}>7 dana</option>
                    </select>
                </div>
            </div>
        </div>
    </header>

    <!-- Priority Actions Section -->
    @if(!empty($priorityActions['urgent']) || !empty($priorityActions['important']))
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-lg p-8 border border-red-200">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <i class="fas fa-exclamation-triangle text-red-600 mr-3"></i>
                    PRIORITETNE AKCIJE ZA DANAS
                </h2>

                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Urgent Actions -->
                    @if(!empty($priorityActions['urgent']))
                        <div>
                            <h3 class="text-lg font-bold text-red-700 mb-4 flex items-center">
                                🔴 HITNO (do 12h):
                            </h3>
                            <div class="space-y-3">
                                @foreach($priorityActions['urgent'] as $action)
                                    <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
                                        <div class="flex items-start justify-between">
                                            <div class="flex-1">
                                                <a href="/api/communication/ai-message/{{ $action['message_id'] }}?reprocess=false" class="font-semibold text-gray-900 mb-1 hover:text-red-600 transition-colors block">
                                                    {{ $action['subject'] }}
                                                </a>
                                                <div class="text-sm text-gray-600 mb-2">
                                                    {{ $action['recommendation'] }}
                                                </div>
                                                <div class="text-xs text-gray-500">
                                                    <i class="far fa-user mr-1"></i>{{ $action['sender'] }} •
                                                    <i class="far fa-clock mr-1"></i>{{ $action['deadline'] }}
                                                </div>
                                            </div>
                                            <div class="flex flex-col gap-2 ml-4">
                                                <a href="/api/communication/ai-message/{{ $action['message_id'] }}?reprocess=false"
                                                   class="text-red-600 hover:text-red-800 transition-colors">
                                                    <i class="fas fa-arrow-right"></i>
                                                </a>
                                                <a href="{{ $action['link'] }}" target="_blank"
                                                   class="text-gray-400 hover:text-red-600 transition-colors text-xs">
                                                    <i class="fas fa-external-link-alt"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endif

                    <!-- Important Actions -->
                    @if(!empty($priorityActions['important']))
                        <div>
                            <h3 class="text-lg font-bold text-yellow-700 mb-4 flex items-center">
                                🟡 VAŽNO (do kraja dana):
                            </h3>
                            <div class="space-y-3">
                                @foreach($priorityActions['important'] as $action)
                                    <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500">
                                        <div class="flex items-start justify-between">
                                            <div class="flex-1">
                                                <a href="/api/communication/ai-message/{{ $action['message_id'] }}?reprocess=false" class="font-semibold text-gray-900 mb-1 hover:text-yellow-600 transition-colors block">
                                                    {{ $action['subject'] }}
                                                </a>
                                                <div class="text-sm text-gray-600 mb-2">
                                                    {{ $action['recommendation'] }}
                                                </div>
                                                <div class="text-xs text-gray-500">
                                                    <i class="far fa-user mr-1"></i>{{ $action['sender'] }} •
                                                    <i class="far fa-clock mr-1"></i>{{ $action['deadline'] }}
                                                </div>
                                            </div>
                                            <div class="flex flex-col gap-2 ml-4">
                                                <a href="/api/communication/ai-message/{{ $action['message_id'] }}?reprocess=false"
                                                   class="text-yellow-600 hover:text-yellow-800 transition-colors">
                                                    <i class="fas fa-arrow-right"></i>
                                                </a>
                                                <a href="{{ $action['link'] }}" target="_blank"
                                                   class="text-gray-400 hover:text-yellow-600 transition-colors text-xs">
                                                    <i class="fas fa-external-link-alt"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>

                <!-- Scheduled & Recommendations -->
                <div class="grid md:grid-cols-2 gap-6 mt-6">
                    <!-- Scheduled -->
                    @if(!empty($priorityActions['scheduled']))
                        <div>
                            <h3 class="text-lg font-bold text-blue-700 mb-4 flex items-center">
                                📅 ZAKAZANO:
                            </h3>
                            <div class="bg-white rounded-lg p-4 shadow-sm">
                                <ul class="space-y-2">
                                    @foreach($priorityActions['scheduled'] as $item)
                                        <li class="flex items-start gap-2 text-sm">
                                            <i class="fas fa-calendar-check text-blue-600 mt-1"></i>
                                            <div class="flex-1">
                                                <a href="/api/communication/ai-message/{{ $item['message_id'] }}?reprocess=false" class="font-medium hover:text-blue-600 transition-colors">
                                                    {{ $item['action'] }}
                                                </a>
                                                <a href="{{ $item['link'] }}" target="_blank"
                                                   class="text-gray-400 hover:text-blue-600 transition-colors ml-2">
                                                    <i class="fas fa-external-link-alt text-xs"></i>
                                                </a>
                                            </div>
                                        </li>
                                    @endforeach
                                </ul>
                            </div>
                        </div>
                    @endif

                    <!-- Recommendations -->
                    @if(!empty($priorityActions['recommendations']))
                        <div>
                            <h3 class="text-lg font-bold text-purple-700 mb-4 flex items-center">
                                💡 PREPORUKE:
                            </h3>
                            <div class="bg-white rounded-lg p-4 shadow-sm">
                                <ul class="space-y-2">
                                    @foreach($priorityActions['recommendations'] as $rec)
                                        <li class="flex items-start gap-2 text-sm">
                                            <i class="fas fa-lightbulb text-purple-600 mt-1"></i>
                                            <div class="flex-1">
                                                <a href="/api/communication/ai-message/{{ $rec['message_id'] }}?reprocess=false" class="hover:text-purple-600 transition-colors">
                                                    {{ $rec['recommendation'] }}
                                                </a>
                                                <a href="{{ $rec['link'] }}" target="_blank"
                                                   class="text-gray-400 hover:text-purple-600 transition-colors ml-2">
                                                    <i class="fas fa-external-link-alt text-xs"></i>
                                                </a>
                                            </div>
                                        </li>
                                    @endforeach
                                </ul>
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </section>
    @endif

    <!-- Messages by Date -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @forelse($groupedMessages as $dateGroup)
            <div class="mb-10">
                <!-- Date Header -->
                <div class="flex items-center mb-6">
                    <div class="flex-1">
                        <h2 class="text-2xl font-bold text-gray-900">
                            {{ $dateGroup['label'] }}
                        </h2>
                        <div class="text-sm text-gray-500 mt-1">
                            {{ count($dateGroup['messages']) }} poruka
                        </div>
                    </div>
                    <div class="text-gray-400">
                        <i class="far fa-calendar-alt text-3xl"></i>
                    </div>
                </div>

                <!-- Messages Grid -->
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    @foreach($dateGroup['messages'] as $message)
                        <div class="message-card {{ $message['priority_level'] }}">
                            <!-- Card Header -->
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-2">
                                    <span class="priority-badge priority-{{ $message['priority_level'] }}">
                                        {{ $message['priority_level'] }}
                                    </span>
                                        @if($message['is_unread'])
                                            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        <i class="fas fa-circle text-blue-600 text-xs mr-1"></i>
                                        Unread
                                    </span>
                                        @endif
                                    </div>
                                    <a href="/api/communication/ai-message/{{ $message['message_id'] }}?reprocess=false" class="font-bold text-gray-900 text-lg leading-tight hover:text-purple-600 transition-colors block">
                                        {{ $message['subject'] }}
                                    </a>
                                    <div class="text-xs text-gray-500 mt-1">
                                        <i class="far fa-user mr-1"></i>{{ $message['sender'] }} •
                                        <i class="far fa-clock mr-1"></i>{{ $message['timestamp'] }}
                                    </div>
                                </div>
                                <div class="flex flex-col gap-2 ml-2">
                                    <a href="/api/communication/ai-message/{{ $message['message_id'] }}?reprocess=false"
                                       class="text-purple-600 hover:text-purple-800 transition-colors">
                                        <i class="fas fa-arrow-right text-lg"></i>
                                    </a>
                                    <a href="{{ $message['gmail_link'] }}" target="_blank"
                                       class="text-gray-400 hover:text-purple-600 transition-colors text-sm">
                                        <i class="fas fa-external-link-alt"></i>
                                    </a>
                                </div>
                            </div>

                            <!-- Scores -->
                            <div class="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                                <div class="flex items-center gap-1">
                                <span class="score-badge {{ $message['business_potential'] >= 7 ? 'score-high' : ($message['business_potential'] >= 4 ? 'score-medium' : 'score-low') }}">
                                    {{ $message['business_potential'] }}
                                </span>
                                    <span class="text-xs text-gray-600">Business</span>
                                </div>
                                <div class="flex items-center gap-1">
                                <span class="score-badge {{ $message['urgency_score'] >= 7 ? 'score-high' : ($message['urgency_score'] >= 4 ? 'score-medium' : 'score-low') }}">
                                    {{ $message['urgency_score'] }}
                                </span>
                                    <span class="text-xs text-gray-600">Urgency</span>
                                </div>
                                <div class="flex items-center gap-1">
                                <span class="score-badge {{ $message['automation_relevance'] >= 7 ? 'score-high' : ($message['automation_relevance'] >= 4 ? 'score-medium' : 'score-low') }}">
                                    {{ $message['automation_relevance'] }}
                                </span>
                                    <span class="text-xs text-gray-600">Auto</span>
                                </div>
                                @if($message['has_attachments'])
                                    <div class="ml-auto">
                                <span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                    <i class="fas fa-paperclip mr-1"></i>{{ $message['attachment_count'] }}
                                </span>
                                    </div>
                                @endif
                            </div>

                            <!-- Summary -->
                            <div class="mb-4">
                                <div class="text-sm text-gray-700 leading-relaxed">
                                    {{ $message['summary'] }}
                                </div>
                            </div>

                            <!-- Recommendation -->
                            @if($message['recommendation'])
                                <div class="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                                    <div class="flex items-start gap-2">
                                        <i class="fas fa-robot text-purple-600 mt-1"></i>
                                        <div class="flex-1">
                                            <div class="text-xs font-semibold text-purple-900 mb-1">AI PREPORUKA:</div>
                                            <div class="text-sm text-purple-800">
                                                {{ $message['recommendation'] }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            @endif

                            <!-- Action Steps -->
                            @if(!empty($message['action_steps']))
                                <div class="mb-4">
                                    <div class="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                        <i class="fas fa-tasks mr-1"></i>Action Steps:
                                    </div>
                                    <div class="space-y-2">
                                        @foreach($message['action_steps'] as $step)
                                            <div class="action-step">
                                                <i class="fas fa-check-circle text-blue-600 mt-0.5"></i>
                                                <span class="flex-1 text-gray-800">{{ $step }}</span>
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            @endif

                            <!-- Footer -->
                            <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                                <div class="flex items-center gap-3 text-xs text-gray-500">
                                <span class="bg-gray-100 px-2 py-1 rounded">
                                    <i class="far fa-folder mr-1"></i>{{ ucfirst(str_replace('_', ' ', $message['category'])) }}
                                </span>
                                    <span>
                                    <i class="far fa-clock mr-1"></i>{{ ucfirst(str_replace('_', ' ', $message['timeline'])) }}
                                </span>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        @empty
            <div class="text-center py-12">
                <div class="text-gray-400 mb-4">
                    <i class="fas fa-inbox text-6xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Nema obrađenih poruka</h3>
                <p class="text-gray-500 mb-4">Pokušajte sa dužim vremenskim periodom ili reprocessirajte poruke.</p>
                <a href="?days=7" class="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold">
                    Prikaži poslednjih 7 dana
                </a>
            </div>
        @endforelse
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600">
                    <i class="fas fa-robot mr-2 text-purple-600"></i>
                    Powered by AI • Unified Messaging System
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                    <a href="/api/communication" class="hover:text-purple-600 transition-colors">
                        <i class="fas fa-code mr-1"></i>API
                    </a>
                    <a href="/api/communication/stats" class="hover:text-purple-600 transition-colors">
                        <i class="fas fa-chart-bar mr-1"></i>Stats
                    </a>
                    <span>{{ \Carbon\Carbon::now()->setTimezone(env('USER_TIMEZONE', 'UTC'))->format('H:i') }}</span>
                </div>
            </div>
        </div>
    </footer>
</div>

<!-- Error Modal (if exists) -->
@if(isset($error))
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="errorModal">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <div class="flex items-start gap-3 mb-4">
                <i class="fas fa-exclamation-circle text-red-600 text-3xl"></i>
                <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Processing Error</h3>
                    <p class="text-sm text-gray-700">{{ $error }}</p>
                </div>
            </div>
            <button onclick="document.getElementById('errorModal').remove()"
                    class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold">
                Close
            </button>
        </div>
    </div>
@endif

<script>
    // Auto-refresh every 5 minutes
    // setTimeout(() => {
    //     window.location.reload();
    // }, 300000);

    // Smooth scroll for external links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
</script>
</body>
</html>
