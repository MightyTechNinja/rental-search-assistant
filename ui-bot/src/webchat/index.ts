import { WebchatAppArgs } from '@botonic/react'
// @ts-ignore
import Chatbot from '../assets/chatbot.jpg';
// @ts-ignore
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
            image: Chatbot,
            style: {
                position: 'relative'
            }
        },
        style: {
            position: 'relative',
            width: '50%',
            height: '80%'
        }
    }
}
