# API Server for Local Git Actions - Product Requirements Document (PRD)

## Overview
This document outlines the requirements for developing a local API server that enables users to perform Git actions on specified repositories. The server will operate locally, receiving commands from an Electron-based desktop application. It will securely manage GitHub authentication through a user-provided private key stored in a configuration file, and execute Git operations on repositories outside of its own codebase—potentially via a dedicated shell instance.

## Problem Statement
Developers and power users often need a streamlined method to perform Git operations without relying on the command line. Manually executing Git commands can be error-prone and cumbersome, especially when managing multiple repositories. The proposed API server aims to abstract the complexity of Git commands, centralize repository management, and integrate seamlessly with a local Electron app, while maintaining security standards for handling sensitive credentials.

## Goals and Objectives
- **Simplify Git Operations:** Abstract complex Git commands into easy-to-use API endpoints.
- **Local Execution:** Ensure all operations run locally on the user's machine.
- **Secure Credential Management:** Handle and store the GitHub private key securely.
- **Flexible Repository Management:** Allow users to add, list, and remove repositories they wish to interact with.
- **Seamless Integration:** Provide a well-documented API for the Electron application to communicate with.
- **Robust Error Handling:** Ensure clear feedback on success or failure of Git operations.

## User Stories
- **As a developer,** I want to configure my GitHub private key in a config file so that I can authenticate Git operations without manual intervention.
- **As a developer,** I want to add repositories to the API server so I can manage multiple projects from one interface.
- **As a developer,** I want to perform common Git commands (clone, pull, push, commit, branch, etc.) via API endpoints so that I can automate my workflow.
- **As a developer,** I want to receive clear success/error messages after Git operations so that I can quickly identify and fix issues.
- **As a developer,** I want the Electron app to communicate securely with the API server so that my operations are protected.

## Functional Requirements
1. **Configuration Management:**
   - The server must read a configuration file containing the GitHub private key.
   - Users should be able to specify which repositories (local paths) are available for operations.

2. **API Endpoints:**
   - **Repository Management:**
     - `POST /repos`: Add a new repository (local path and metadata) to be managed.
     - `GET /repos`: Retrieve a list of all managed repositories.
     - `DELETE /repos/{repoId}`: Remove a repository from management.
   - **Git Operations:**
     - `POST /repos/{repoId}/git`: Execute a specified Git command (e.g., clone, pull, push, commit, branch) on the target repository.
     - Request body should include command parameters and options.
     - The response should include the command's output and error information, if any.

3. **Git Command Execution:**
   - The API server must execute Git commands on repositories not part of its own repository.
   - Consider using a dedicated shell instance (or similar mechanism) to execute these commands securely and in isolation.
   - Capture and return both stdout and stderr from Git operations.
   - Run python subprocesses to execute Git commands for each operation. 

4. **Security and Authentication:**
   - Securely store and manage the GitHub private key.
   - Validate and sanitize all inputs to prevent command injection or other security vulnerabilities.
   - Log all API requests and Git command executions for audit purposes.
   - Optionally, restrict API access to the local machine or implement additional authentication if needed.

5. **Error Handling:**
   - Return meaningful error messages for failed operations (e.g., invalid repository path, Git command errors).
   - Implement retry mechanisms for transient errors.
   - Ensure the API gracefully handles unexpected failures.

## Non-functional Requirements
- **Performance:** 
  - The API server should process and respond to requests within acceptable time frames (e.g., <500ms for most operations).
- **Reliability:** 
  - Ensure robustness in executing Git commands, with proper error recovery and logging.
- **Usability:** 
  - Provide comprehensive API documentation for the Electron app integration.
  - Design the API to be intuitive and easy to use.
- **Security:** 
  - Handle sensitive data (e.g., private keys) securely using encryption and appropriate file permissions.
  - Ensure that all communication between the Electron app and API server is secure (e.g., via HTTPS or secure IPC mechanisms).
- **Maintainability:** 
  - Use a modular code structure with clear separation between configuration management, API handling, and Git command execution.
  - Write comprehensive unit and integration tests.

## Architecture Overview
- **API Server:**
  - A local HTTP server (e.g., built with Node.js) that exposes the defined REST API endpoints.
  - Implements middleware for authentication, logging, and error handling.

- **Git Command Module:**
  - A dedicated module responsible for translating API requests into Git command executions.
  - Utilizes a dedicated shell instance (e.g., using Node.js's `child_process`) to run Git commands.

- **Configuration Manager:**
  - Handles reading and parsing the configuration file for the GitHub private key and repository definitions.
  - Monitors for configuration changes and reloads settings as needed.

- **Electron Application:**
  - A desktop client that consumes the API endpoints, providing a graphical interface for managing repositories and executing Git operations.
  
**API Requirements:**
    - params:
        - repo_path: str
        - command: str
    - returns:
        - stdout: str
        - stderr: str
  
## Dependencies
- **Runtime Environment:** Node.js (or a similar environment capable of running a local HTTP server).
- **Version Control:** Git must be installed on the local machine.
- **Frameworks & Libraries:**
  - Express (or equivalent) for the API server.
  - Electron for the desktop application.
  - Child process management (e.g., Node.js's `child_process` module) for executing shell commands.
- **Security Libraries:** For encrypting and securely storing the GitHub private key.

## Risks and Mitigation Strategies
- **Security Risks:**
  - *Risk:* Exposure or misuse of the GitHub private key.
  - *Mitigation:* Use encryption, secure file permissions, and limit API access to the local machine.

- **Command Injection:**
  - *Risk:* Unsanitized input leading to command injection vulnerabilities.
  - *Mitigation:* Validate and sanitize all inputs rigorously before executing commands.

- **Performance Bottlenecks:**
  - *Risk:* Slow response times due to heavy Git operations.
  - *Mitigation:* Optimize command execution, use asynchronous processing, and provide user feedback during long-running operations.

- **Error Handling:**
  - *Risk:* Inadequate error handling may lead to application crashes or data corruption.
  - *Mitigation:* Implement robust error handling and logging mechanisms to capture and respond to errors gracefully.

## Timeline and Milestones
1. **Phase 1: Requirements and Design (1 week)**
   - Finalize PRD, architecture, and technical stack.
2. **Phase 2: API Server Development (2-3 weeks)**
   - Develop core API endpoints and configuration management.
3. **Phase 3: Git Command Module Implementation (2 weeks)**
   - Implement and test the module for executing Git commands via a shell instance.
4. **Phase 4: Electron App Integration (2 weeks)**
   - Develop a basic Electron interface and integrate it with the API server.
5. **Phase 5: Testing and QA (1 week)**
   - Conduct unit tests, integration tests, and security audits.
6. **Phase 6: Documentation and Deployment (1 week)**
   - Finalize API documentation, user guides, and prepare deployment.

## Future Considerations
- **Enhanced Git Operations:** Expand support for additional Git functionalities and workflows.
- **Remote Repository Integration:** Explore capabilities to interact with remote repositories directly.
- **User Authentication Enhancements:** Implement more granular user authentication mechanisms beyond a configuration file.
- **Cross-platform Optimization:** Ensure compatibility across Windows, macOS, and Linux environments.

## Appendix
- **Glossary:**
  - **API Server:** The local server handling HTTP requests from the Electron app.
  - **Electron App:** The desktop application that interacts with the API server.
  - **GitHub Private Key:** A credential used for authenticating Git operations with GitHub.
- **References:**
  - [GitHub Documentation](https://docs.github.com/)
  - [Electron Documentation](https://www.electronjs.org/docs)
  - [Node.js Child Process Documentation](https://nodejs.org/api/child_process.html)
