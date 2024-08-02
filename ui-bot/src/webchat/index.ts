import { WebchatAppArgs } from '@botonic/react'
import Chatbot from '../assets/chatbot.jpg';
import Resortifi from '../assets/resortifi.png';

export const webchat: WebchatAppArgs = {
    theme: {
        header: {
            title: "Resortifi"
        },
        brand: {
            image: Resortifi
        },
        triggerButton: {
            image: Chatbot
        }
    }
}
