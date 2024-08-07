'use client'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'


export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I can help you with questions regarding immigrant students in the US. How can I assist you today?`
    },
  ])

  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }])
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function proccessText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return ([
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text
            }
          ])
        })
        return reader.read().then(proccessText)
      })
    })
  }



  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center">
      <Typography
        fontFamily="Marker Felt"
        fontSize="xxx-large"
        color="#1976d2">
        CHAT
      </Typography>
      <Box
        width="70vw"
        height="100vh"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          direction="column"
          width="600px"
          height="700px"
          border="3px ridge dimgrey"
          p={2}
          spacing={3}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'assistant' ? 'primary.main' : 'secondary.main'
                  }
                  color="white"
                  borderRadius={16}
                  p={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  sendMessage()
                }
              }}
            />
            <Button variant="contained" onClick={sendMessage}>Send</Button>
          </Stack>
        </Stack>
      </Box>
      <Typography
        fontFamily="Marker Felt"
        fontSize="xxx-large"
        color="#9c27b0">
        BOT
      </Typography>
    </Box>
  )
}