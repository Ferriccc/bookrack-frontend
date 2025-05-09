<template>
  <div class="chatbot-container" :class="{ 'is-open': isOpen }">
    <!-- Chat Toggle Button -->
    <button class="chat-toggle" @click="toggleChat" :class="{ 'is-open': isOpen }">
      <i class="bi" :class="isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'"></i>
    </button>

    <!-- Chat Interface -->
    <div class="chat-interface" v-show="isOpen">
      <div class="chat-header">
        <h3>BookRack Assistant</h3>
        <p class="subtitle">Ask me anything about books!</p>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="message.type"
        >
          <div class="message-content">
            <i v-if="message.type === 'bot'" class="bi bi-robot"></i>
            <div
              v-if="message.type === 'bot'"
              class="markdown-content"
              v-html="renderMarkdown(message.text)"
            ></div>
            <span v-else>{{ message.text }}</span>
          </div>
        </div>
        <div v-if="isLoading" class="message bot">
          <div class="message-content loading">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>

      <form @submit.prevent="sendMessage" class="chat-input">
        <input
          v-model="userInput"
          type="text"
          placeholder="Type your message..."
          :disabled="isLoading"
        />
        <button type="submit" :disabled="isLoading || !userInput.trim()">
          <i class="bi bi-send-fill"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { API_ENDPOINTS, apiClient } from '@/config/api'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

interface ChatMessage {
  text: string
  type: 'user' | 'bot'
}

const route = useRoute()
const isOpen = ref(false)
const userInput = ref('')
const messages = ref<ChatMessage[]>([])
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

// Configure marked options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
})

const renderMarkdown = (text: string) => {
  // Handle undefined or null input
  if (!text) return ''

  // Parse markdown and sanitize the resulting HTML
  const rawHtml = marked.parse(text) as string
  return DOMPurify.sanitize(rawHtml)
}

// Initial greeting
messages.value.push({
  text: "Hi! I'm your BookRack Assistant. How can I help you today?",
  type: 'bot',
})

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    const container = messagesContainer.value
    container.scrollTop = container.scrollHeight
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage = userInput.value.trim()
  messages.value.push({ text: userMessage, type: 'user' })
  userInput.value = ''
  await scrollToBottom()

  isLoading.value = true

  try {
    const bookId = route.params.id as string | undefined
    const endpoint = API_ENDPOINTS.CHAT(userMessage, bookId)
    const data = await apiClient.fetch(endpoint)
    messages.value.push({ text: data.response, type: 'bot' })
  } catch {
    messages.value.push({
      text: "Sorry, I'm having trouble connecting right now. Please try again later.",
      type: 'bot',
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

// Watch messages for changes and scroll to bottom
watch(
  messages,
  async () => {
    await scrollToBottom()
  },
  { deep: true },
)

// Watch for chat open/close to scroll to bottom
watch(isOpen, async (newValue) => {
  if (newValue) {
    await scrollToBottom()
  }
})
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.chat-toggle {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: #000000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chat-toggle:hover {
  transform: scale(1.05);
  background: rgba(0, 0, 0, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
}

.chat-toggle.is-open {
  background: #1a1a1a;
}

.chat-interface {
  position: absolute;
  bottom: calc(100% + 1rem);
  right: 0;
  width: 420px;
  height: 500px;
  background: #000000;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.chat-header {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-header h3 {
  margin: 0;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
}

.chat-header .subtitle {
  margin: 0.25rem 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  scroll-behavior: smooth;
}

.message {
  max-width: 85%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: white;
  animation: fadeIn 0.3s ease;
  font-size: 0.95rem;
}

.message.user {
  background: rgba(255, 255, 255, 0.1);
  align-self: flex-end;
}

.message.bot {
  background: rgba(255, 255, 255, 0.05);
  align-self: flex-start;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.4;
}

.message-content i {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.2rem;
}

.chat-input {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 0.5rem;
}

.chat-input input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
}

.chat-input input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

.chat-input button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0 0.5rem;
  font-size: 1.2rem;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.chat-input button:hover:not(:disabled) {
  opacity: 1;
  transform: scale(1.1);
}

.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  display: flex;
  gap: 0.3rem;
}

.dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: bounce 1s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Custom Scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.markdown-content {
  line-height: 1.5;
  font-size: 0.95rem;
}

.markdown-content :deep(p) {
  margin: 0.4em 0;
}

.markdown-content :deep(p:first-child) {
  margin-top: 0;
}

.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.markdown-content :deep(li) {
  margin: 0.25em 0;
}

.markdown-content :deep(code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: var(--font-geist-mono);
  font-size: 0.85em;
}

.markdown-content :deep(pre) {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0.5em 0;
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 0.85em;
}

.markdown-content :deep(blockquote) {
  margin: 0.75em 0;
  padding-left: 1em;
  border-left: 3px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
}

.markdown-content :deep(a) {
  color: #58a6ff;
  text-decoration: none;
  transition: color 0.2s ease;
}

.markdown-content :deep(a:hover) {
  color: #79b6ff;
  text-decoration: underline;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0.75em 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5em;
  text-align: left;
}

.markdown-content :deep(th) {
  background: rgba(255, 255, 255, 0.05);
}

.markdown-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 0.75em 0;
}

.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 1em 0;
}

/* Ensure inline elements maintain proper spacing */
.markdown-content :deep(strong),
.markdown-content :deep(em),
.markdown-content :deep(code),
.markdown-content :deep(a) {
  margin: 0 0.1em;
}

.markdown-content :deep(strong) {
  color: white;
}

.markdown-content :deep(em) {
  color: rgba(255, 255, 255, 0.9);
}
</style>
