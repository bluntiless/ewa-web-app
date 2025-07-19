import { useState } from 'react';

export default function TestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [testStatus, setTestStatus] = useState('Pending');
  const [testFeedback, setTestFeedback] = useState('');

  const loadTestData = () => {
    const savedData = localStorage.getItem('test_assessment');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setTestStatus(data.status || 'Pending');
        setTestFeedback(data.feedback || '');
        console.log('Loaded test data:', data);
      } catch (e) {
        console.warn('Failed to load test data:', e);
      }
    }
  };

  const testEvidenceItem = {
    id: 'test-123',
    name: 'test-document.pdf',
    webUrl: 'https://example.com/test.pdf',
    status: testStatus,
    assessorFeedback: testFeedback
  };

  const handleSave = () => {
    console.log('Test save:', { status: testStatus, feedback: testFeedback });
    
    // Store in localStorage
    const testData = {
      status: testStatus,
      feedback: testFeedback,
      assessor: 'Wayne Wright',
      date: new Date().toISOString()
    };
    
    localStorage.setItem('test_assessment', JSON.stringify(testData));
    console.log('Test assessment saved to localStorage');
    
    setIsOpen(false);
  };

  return (
    <div className="p-4">
      <button
        onClick={() => {
          loadTestData();
          setIsOpen(true);
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Test Modal
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Test Assessment Modal</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status:</label>
              <select
                value={testStatus}
                onChange={(e) => setTestStatus(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Feedback:</label>
              <textarea
                value={testFeedback}
                onChange={(e) => setTestFeedback(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 