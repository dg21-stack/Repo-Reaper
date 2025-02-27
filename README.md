# Git Operations API Server 🚀

## Overview
A local API server that allows you to perform Git operations on your repositories through simple HTTP requests. Designed to be used with an Electron desktop application to provide a user-friendly interface for Git commands.

## Features
- ✅ Execute Git commands via API endpoints
- 🔒 Secure GitHub authentication using your private key
- 📁 Manage multiple repositories from one interface
- 🛠️ Simplify complex Git operations into easy API calls
- 💻 All operations run locally on your machine

## Installation

### Prerequisites
- Git installed on your system
- Python 3.6+
- Node.js (for the companion Electron app)

### Setup
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/git-operations-api.git
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Configure your GitHub credentials in a configuration file

## Usage

### Starting the Server
