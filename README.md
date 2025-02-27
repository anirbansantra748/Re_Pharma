# Emora-
  **AI-driven mental wellness at your fingertips. Anonymously track your mood, chat with AI, and access personalized therapy tools**
## Welcome to the World of AI  (.)(.)


### HUGGINGFACE_API_KEY IS STORED IN AN ENV FILE inside .gitignore file

**install dotenv to acess API**

> pip install python-dotenv  # For Python apps
> npm install dotenv  # For Node.js apps


1) for node--
require("dotenv").config();

const API_KEY = process.env.HUGGINGFACE_API_KEY;

2) for python --

import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

API_KEY = os.getenv("HUGGINGFACE_API_KEY")  # Fetch API key




<!-- <div class="navbar-nav">
                    <% if (user) { %>
                        <span class="navbar-text text-light me-3">
                            <i class="fas fa-user-circle"></i> Hello, <%= user.username %>
                        </span>
                        <a class="btn btn-outline-light" href="user/logout">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    <% } else { %>
                        <a class="btn btn-outline-light me-2" href="/user/login">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </a>
                        <a class="btn btn-primary" href="user/signup">
                            <i class="fas fa-user-plus"></i> Sign Up
                        </a>
                    <% } %>
                </div> -->


<% layout("/layouts/boilerplate") %>


<form action="/ai/chat" method="POST">
    <div>
        <h2>AI Chat</h2>
        <div id="chat-box"></div>

        <input type="text" id="message-input" name="message" placeholder="Type your message..." required>
        <button type="submit">Send</button>
    </div>
</form>
