import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SharePointService, AssessmentStatus, EvidenceMetadata } from '../services/SharePointService';
import { AssessmentService } from '../services/AssessmentService';
import BottomNavigation from '../components/BottomNavigation';
import { useMsalAuth } from '../lib/useMsalAuth';

export default function AssessorEvidenceReview() {
  const router = useRouter();
  const { account, loading, error: msalError } = useMsalAuth();
  const [evidence, setEvidence] = useState<EvidenceMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AssessmentStatus>(AssessmentStatus.Pending);
  const [feedback, setFeedback] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { evidenceId, candidateName, unitCode, criteriaCode } = router.query;

  useEffect(() => {
    if (account && evidenceId) {
      loadEvidence();
    }
  }, [account, evidenceId]);

  const loadEvidence = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const spService = SharePointService.getInstance();
      await spService.authenticate();

      // Load the specific evidence item
      if (typeof evidenceId === 'string') {
        const evidenceData = await spService.fetchEvidenceMetadata(evidenceId);
        setEvidence(evidenceData);
        setStatus(evidenceData.assessmentStatus || AssessmentStatus.Pending);
        setFeedback(evidenceData.assessorFeedback || '');
      } else {
        setError('Invalid evidence ID');
      }

    } catch (err) {
      console.error('Failed to load evidence:', err);
      setError(err instanceof Error ? err.message : 'Failed to load evidence');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!evidence || !evidence.webUrl) return;

    try {
      setIsSaving(true);
      setError(null);

      const assessmentService = AssessmentService.getInstance();
      await assessmentService.updateAssessmentStatus(evidence.webUrl, {
        status,
        feedback,
        assessorName: 'Assessor' // Replace with real assessor name
      });

      // Show success message and go back
      router.push('/assessor-review');

    } catch (err) {
      console.error('Failed to save assessment:', err);
      setError(err instanceof Error ? err.message : 'Failed to save assessment');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = () => {
    setStatus(AssessmentStatus.Approved);
  };

  const handleReject = () => {
    setStatus(AssessmentStatus.Rejected);
  };

  const handleNeedsRevision = () => {
    setStatus(AssessmentStatus.Pending);
  };

  if (loading) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-lg">Loading evidence...</p>
    </div>
  </div>;

  if (msalError) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
    <div className="text-center max-w-lg mx-auto px-4">
      <div className="text-red-500 text-xl mb-4">Authentication Error</div>
      <p className="text-gray-400">{String(msalError)}</p>
    </div>
  </div>;

  if (!account) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
    <div className="text-center">
      <p className="text-lg">Signing in...</p>
    </div>
  </div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-safe">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()}
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Dashboard
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Evidence Review</h1>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading evidence...</div>
        ) : error ? (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        ) : !evidence ? (
          <div className="text-center py-8 text-gray-500">Evidence not found.</div>
        ) : (
          <div className="space-y-6">
            {/* Evidence Details */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Evidence Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Candidate</label>
                  <p className="text-white">{candidateName || 'Unknown'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Unit</label>
                  <p className="text-white">{unitCode || evidence.unitCode || 'Unknown'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Criteria</label>
                  <p className="text-white">{criteriaCode || evidence.criteriaCode || 'Unknown'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Uploaded</label>
                  <p className="text-white">
                    {evidence.createdDateTime ? new Date(evidence.createdDateTime).toLocaleString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Evidence Preview */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Evidence File</h2>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{evidence.name}</h3>
                  {evidence.description && (
                    <p className="text-gray-400 mt-1">{evidence.description}</p>
                  )}
                </div>
                <a
                  href={evidence.downloadUrl || evidence.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  View File
                </a>
              </div>
            </div>

            {/* Assessment */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Assessment</h2>
              
              {/* Status Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Assessment Status</label>
                <div className="flex space-x-4">
                  <button
                    onClick={handleApprove}
                    className={`px-4 py-2 rounded-lg ${
                      status === AssessmentStatus.Approved
                        ? 'bg-green-600 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                    }`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleReject}
                    className={`px-4 py-2 rounded-lg ${
                      status === AssessmentStatus.Rejected
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                    }`}
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleNeedsRevision}
                    className={`px-4 py-2 rounded-lg ${
                      status === AssessmentStatus.Pending
                        ? 'bg-yellow-600 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                    }`}
                  >
                    Needs Revision
                  </button>
                </div>
              </div>

              {/* Feedback */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full bg-neutral-800 text-white rounded-lg px-4 py-2 border border-neutral-700 focus:border-blue-500 focus:outline-none"
                  placeholder="Provide feedback for the candidate..."
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Assessment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
} 