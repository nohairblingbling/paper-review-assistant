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
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="input input-bordered"
              required
            />
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
