import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { saveApiConfig, getApiConfig } from '../utils/storage';

export default function SettingsPage() {
  const [provider, setProvider] = useState<'openai' | 'claude'>('openai');
  const [apiKey, setApiKey] = useState('');
  const [apiBase, setApiBase] = useState('');
  const [apiModel, setApiModel] = useState('');
  const [message, setMessage] = useState('');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  useEffect(() => {
    const config = getApiConfig();
    if (config) {
      setProvider(config.provider);
      setApiKey(config.apiKey);
      setApiBase(config.apiBase || '');
      setApiModel(config.apiModel || '');
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveApiConfig({ provider, apiKey, apiBase, apiModel });
    setMessage('API configuration saved successfully');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-base-100 rounded-lg shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center mb-6">API Configuration</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">API Provider</span>
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as 'openai' | 'claude')}
              className="select select-bordered"
            >
              <option value="openai">OpenAI</option>
              <option value="claude">Claude</option>
            </select>
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">API Key</span>
            </label>
            <div className="relative">
              <input
                type={isApiKeyVisible ? "text" : "password"}
                placeholder="Enter your API key"
                className="input input-bordered w-full pr-10"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
              >
                {isApiKeyVisible ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">API Base URL (Optional)</span>
            </label>
            <input
              type="text"
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
              className="input input-bordered"
            />
            <label className="label">
              <span className="label-text-alt">Enter proxy URL if using API proxy</span>
            </label>
          </div>
          {provider === 'openai' && (
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">API Model (Optional)</span>
              </label>
              <input
                type="text"
                value={apiModel}
                onChange={(e) => setApiModel(e.target.value)}
                className="input input-bordered"
              />
              <label className="label">
                <span className="label-text-alt">e.g., gpt-3.5-turbo, gpt-4</span>
              </label>
            </div>
          )}
          <div className="form-control mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn btn-primary"
            >
              Save Configuration
            </motion.button>
          </div>
        </form>
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="alert alert-info mt-4"
          >
            <div className="flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <label>{message}</label>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
