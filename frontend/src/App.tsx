import { AuthProvider, useAuth } from './AuthContext';
import AuthForm from './AuthForm';
import Pomodoro from './Pomodoro';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section id="center">
        <p>Loading…</p>
      </section>
    );
  }

  return <section id="center">{user ? <Pomodoro /> : <AuthForm />}</section>;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
