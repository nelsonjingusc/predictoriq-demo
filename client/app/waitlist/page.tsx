'use client';

import { useState } from 'react';
import { PredictorIQClient, WaitlistSubmission } from '@predictoriq/sdk';

const client = new PredictorIQClient({
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
});

export default function WaitlistPage() {
  const [formData, setFormData] = useState<WaitlistSubmission>({
    email: '',
    name: '',
    plan_interest: 'pro',
    use_case: '',
    referral_source: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await client.submitWaitlist(formData);
      if (result.success) {
        setSubmitted(true);
        setPosition(result.position || null);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You're on the list!</h2>
          {position && (
            <p className="text-lg text-gray-600 mb-4">
              You're <strong>#{position}</strong> in line
            </p>
          )}
          <p className="text-gray-500">
            We'll email you when your access is ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Join the Waitlist
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Get early access to PredictorIQ Pro features
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Interest
            </label>
            <select
              value={formData.plan_interest}
              onChange={(e) => setFormData({ ...formData, plan_interest: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="agent">Agent</option>
              <option value="institutional">Institutional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Use Case
            </label>
            <textarea
              value={formData.use_case}
              onChange={(e) => setFormData({ ...formData, use_case: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="How do you plan to use PredictorIQ?"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Join Waitlist
          </button>
        </form>
      </div>
    </div>
  );
}
