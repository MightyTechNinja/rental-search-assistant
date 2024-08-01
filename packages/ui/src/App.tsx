import "./App.css";
import Chatbot, {
  // FloatingActionButtonTrigger,
  ActionButtonTrigger,
  // InputBarTrigger,
  ModalView,
} from "mongodb-chatbot-ui";

function MyApp() {
  const suggestedPrompts = [
    "Why should I use the MongoDB Chatbot Framework?",
    "How does the framework use Atlas Vector Search?",
    "Do you support using LLMs from OpenAI?",
  ];
  // const suggestedPrompts = [
  //   "Can I find Aaron Shoals",
  //   "Properties people love staying at",
  //   "Bluebird House and excellent stay!",
  // ];
  return (
    <div>
      <Chatbot isExperimental={false} serverBaseUrl="http://localhost:3000/api/v1">
        <>
          {/* <InputBarTrigger suggestedPrompts={suggestedPrompts} /> */}
          {/* <FloatingActionButtonTrigger text="My MongoDB AI" /> */}
          <ActionButtonTrigger /> 
          <ModalView
            initialMessageText="Welcome. What can I help you with?"
            initialMessageSuggestedPrompts={suggestedPrompts}
          />
        </>
      </Chatbot>
    </div>
  );
}

export default MyApp;
