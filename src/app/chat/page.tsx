import ChatInterface from '@/components/chat-interface';
import Footer from '@/components/footer';
import Header from '@/components/header';

export default function ChatPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <ChatInterface />
      </main>
      <Footer />
    </div>
  );
}
