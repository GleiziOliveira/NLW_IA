import { server } from "./server.js"

const form = document.querySelector("#form")
const input = document.querySelector("#url")
const content = document.querySelector("#content")

form.addEventListener("submit", async (event) => {
  event.preventDefault()
  content.classList.add("placeholder")

  const videoURL = input.value

  if (!videoURL.includes("shorts")) {
    // Trate melhor essa condição, exibindo uma mensagem de erro mais descritiva para o usuário.
    // Por exemplo, você pode informar que a URL inserida não é um vídeo do YouTube Shorts.
    return (content.textContent =
      "URL inválida para um vídeo do YouTube Shorts.")
  }

  try {
    const [_, params] = videoURL.split("/shorts/")
    const [videoID] = params.split("?si")

    content.textContent = "Obtendo o texto do áudio..."

    // Certifique-se de que você está tratando erros aqui, caso a solicitação falhe.
    const transcription = await server.get("/summary/" + videoID)

    content.textContent = "Realizando o resumo..."

    // Lembre-se de tratar erros aqui também, caso a solicitação falhe.
    const summary = await server.post("/summary", {
      text: transcription.data.result,
    })

    content.textContent = summary.data.result
    content.classList.remove("placeholder")
  } catch (error) {
    // Em caso de erros, você pode tratar e exibir mensagens de erro amigáveis para o usuário.
    console.error("Ocorreu um erro:", error)
    content.textContent = "Ocorreu um erro ao processar o vídeo."
    content.classList.remove("placeholder")
  }
})
