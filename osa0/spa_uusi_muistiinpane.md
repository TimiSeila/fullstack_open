```mermaid
sequenceDiagram
    participant browser
    participant server
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Status 201 Created
    deactivate server
    Note right of browser: Excecutes code in the JS file that adds created note to server and redraws the notes on the page
