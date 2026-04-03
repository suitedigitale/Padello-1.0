import React, { useState } from 'react';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logica per il recupero password
    console.log('Recupero password per:', email);
  };

  return (
    <div className="forgot-password-form">
      <h2>Recupero Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Inserisci la tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Invia</button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;