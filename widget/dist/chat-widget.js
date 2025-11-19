"use strict";
var ChatWidget = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    default: () => src_default
  });
  var generateId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };
  var DEFAULT_GREETING = "Hi! \u{1F44B} You can write to me in your own language. How can I help you today? Are you interested in buying, selling, renting, or do you have a question about a property?";
  var STORAGE_PREFIX = "chat_widget_state_";
  var ChatWidgetCore = class {
    constructor(config) {
      this.isSending = false;
      this.config = config;
      this.hasStorage = typeof window !== "undefined" && !!window.localStorage;
      this.state = this.loadState();
      this.ensureInitialMessages();
      this.render();
      if (this.state.isOpen) {
        this.open();
      }
    }
    ensureInitialMessages() {
      if (this.state.messages.length === 0) {
        this.state.messages.push({
          id: generateId(),
          sender: "bot",
          text: DEFAULT_GREETING,
          timestamp: Date.now()
        });
        this.persistState();
      }
    }
    render() {
      this.container = document.createElement("div");
      this.container.className = "chat-widget-container";
      this.applyPosition();
      this.applyColors();
      this.chatWindow = document.createElement("div");
      this.chatWindow.className = "chat-window";
      const header = this.createHeader();
      this.messagesEl = document.createElement("div");
      this.messagesEl.className = "chat-messages";
      this.quickRepliesEl = document.createElement("div");
      this.quickRepliesEl.className = "chat-quick-replies";
      const inputArea = this.createInputArea();
      this.chatWindow.append(header, this.messagesEl, this.quickRepliesEl, inputArea);
      this.renderMessages();
      this.toggleButton = this.createToggleButton();
      this.container.append(this.chatWindow, this.toggleButton);
      document.body.appendChild(this.container);
    }
    createHeader() {
      const header = document.createElement("div");
      header.className = "chat-window-header";
      const logo = document.createElement("img");
      logo.src = this.config.agencyLogoUrl;
      logo.alt = `${this.config.agencyName} logo`;
      const info = document.createElement("div");
      const title = document.createElement("div");
      title.className = "chat-window-title";
      title.textContent = this.config.agencyName;
      const subtitle = document.createElement("div");
      subtitle.className = "chat-window-subtitle";
      subtitle.textContent = "Online Assistant";
      info.append(title, subtitle);
      header.append(logo, info);
      return header;
    }
    createInputArea() {
      const wrapper = document.createElement("div");
      wrapper.className = "chat-input";
      this.textarea = document.createElement("textarea");
      this.textarea.placeholder = "Type your message";
      this.textarea.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          this.handleSend();
        }
      });
      const sendButton = document.createElement("button");
      sendButton.textContent = "Send";
      sendButton.addEventListener("click", () => this.handleSend());
      wrapper.append(this.textarea, sendButton);
      return wrapper;
    }
    createToggleButton() {
      const button = document.createElement("button");
      button.className = "chat-widget-toggle";
      const avatar = document.createElement("img");
      avatar.src = this.config.agencyLogoUrl;
      avatar.alt = `${this.config.agencyName} avatar`;
      button.appendChild(avatar);
      button.addEventListener("click", () => {
        if (this.chatWindow.classList.contains("open")) {
          this.close();
        } else {
          this.open();
        }
      });
      return button;
    }
    renderMessages() {
      this.messagesEl.innerHTML = "";
      this.state.messages.slice(-50).forEach((message) => {
        const bubble = document.createElement("div");
        bubble.className = `chat-message ${message.sender}`;
        bubble.textContent = message.text;
        this.messagesEl.appendChild(bubble);
      });
      this.scrollToBottom();
    }
    renderQuickReplies(replies) {
      this.quickRepliesEl.innerHTML = "";
      replies.forEach((reply) => {
        const button = document.createElement("button");
        button.className = "chat-quick-reply";
        button.textContent = reply.label;
        button.addEventListener("click", () => {
          this.quickRepliesEl.innerHTML = "";
          this.sendMessage(reply.value, { category: reply.value });
        });
        this.quickRepliesEl.appendChild(button);
      });
    }
    handleSend() {
      if (this.isSending)
        return;
      const text = this.textarea.value.trim();
      if (!text)
        return;
      this.textarea.value = "";
      this.sendMessage(text);
    }
    async sendMessage(text, additionalMetadata) {
      var _a;
      const message = {
        id: generateId(),
        sender: "user",
        text,
        timestamp: Date.now()
      };
      this.state.messages.push(message);
      this.persistState();
      this.renderMessages();
      this.renderQuickReplies([]);
      this.showTyping();
      const metadata = __spreadValues({
        language: (_a = this.state.language) != null ? _a : this.config.languageFallback,
        page_url: window.location.href,
        client_id: this.config.clientId
      }, additionalMetadata);
      this.isSending = true;
      try {
        const response = await fetch(this.config.apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: this.state.conversationId,
            user_message: text,
            metadata
          })
        });
        const data = await response.json();
        this.handleApiResponse(data);
      } catch (error) {
        console.error("ChatWidget error", error);
        this.appendBotMessage("Sorry, I was unable to process that. Please try again.");
      } finally {
        this.hideTyping();
        this.isSending = false;
      }
    }
    handleApiResponse(data) {
      var _a;
      if (!data)
        return;
      this.state.conversationId = data.conversation_id || this.state.conversationId;
      const detectedLanguage = data.ui_hints && (data.ui_hints["language"] || data.ui_hints["detected_language"]) || void 0;
      if (detectedLanguage) {
        this.state.language = String(detectedLanguage);
      }
      if (data.assistant_message) {
        this.appendBotMessage(data.assistant_message);
      }
      this.renderQuickReplies((_a = data.quick_replies) != null ? _a : []);
      this.persistState();
    }
    appendBotMessage(text) {
      this.state.messages.push({
        id: generateId(),
        sender: "bot",
        text,
        timestamp: Date.now()
      });
      this.renderMessages();
    }
    showTyping() {
      if (this.typingIndicator)
        return;
      const indicator = document.createElement("div");
      indicator.className = "chat-message bot";
      const dots = document.createElement("div");
      dots.className = "chat-typing-indicator";
      dots.innerHTML = "<span></span><span></span><span></span>";
      indicator.appendChild(dots);
      this.typingIndicator = indicator;
      this.messagesEl.appendChild(indicator);
      this.scrollToBottom();
    }
    hideTyping() {
      if (!this.typingIndicator)
        return;
      this.messagesEl.removeChild(this.typingIndicator);
      this.typingIndicator = void 0;
    }
    open() {
      this.chatWindow.classList.add("open");
      this.state.isOpen = true;
      this.persistState();
    }
    close() {
      this.chatWindow.classList.remove("open");
      this.state.isOpen = false;
      this.persistState();
    }
    applyPosition() {
      if (this.config.position === "bottom-left") {
        this.container.style.right = "auto";
        this.container.style.left = "24px";
      }
    }
    applyColors() {
      const root = document.documentElement;
      if (this.config.primaryColor) {
        root.style.setProperty("--chat-primary", this.config.primaryColor);
      }
      if (this.config.accentColor) {
        root.style.setProperty("--chat-accent", this.config.accentColor);
      }
      if (this.config.bubbleColorUser) {
        root.style.setProperty("--chat-user-bubble", this.config.bubbleColorUser);
      }
      if (this.config.bubbleColorBot) {
        root.style.setProperty("--chat-bot-bubble", this.config.bubbleColorBot);
      }
    }
    persistState() {
      if (!this.hasStorage)
        return;
      try {
        if (this.state.messages.length > 50) {
          this.state.messages = this.state.messages.slice(-50);
        }
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      } catch (error) {
        console.warn("Unable to persist chat widget state", error);
      }
    }
    loadState() {
      if (!this.hasStorage) {
        return { messages: [] };
      }
      try {
        const raw = localStorage.getItem(this.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            conversationId: parsed.conversationId,
            language: parsed.language,
            isOpen: parsed.isOpen,
            messages: Array.isArray(parsed.messages) ? parsed.messages : []
          };
        }
      } catch (error) {
        console.warn("Unable to load chat widget state", error);
      }
      return { messages: [] };
    }
    get storageKey() {
      return `${STORAGE_PREFIX}${this.config.clientId}`;
    }
    scrollToBottom() {
      requestAnimationFrame(() => {
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
      });
    }
  };
  var ChatWidget = {
    init(config) {
      if (!(config == null ? void 0 : config.apiUrl)) {
        console.error("ChatWidget: apiUrl is required");
        return;
      }
      const start = () => new ChatWidgetCore(config);
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
      } else {
        start();
      }
    }
  };
  if (typeof window !== "undefined") {
    window.ChatWidget = ChatWidget;
  }
  var src_default = ChatWidget;
  return __toCommonJS(src_exports);
})();
