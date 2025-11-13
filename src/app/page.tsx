'use client'
import React, { useEffect, useState } from 'react'
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk'
import { Proof } from '@reclaimprotocol/js-sdk'
import { providers, Provider } from '@/config/providers'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [proofData, setProofData] = useState<Proof[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reclaimProofRequest, setReclaimProofRequest] = useState<ReclaimProofRequest | null>(null)
  const [requestUrl, setRequestUrl] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(providers[0] || null)

  useEffect(() => {
    // Initialize the ReclaimProofRequest when the component mounts or provider changes
    if (selectedProvider) {
      initializeReclaimProofRequest(selectedProvider)
    }
  }, [selectedProvider])

  async function initializeReclaimProofRequest(provider: Provider) {
    try {
      const proofRequest = await ReclaimProofRequest.init(
        process.env.NEXT_PUBLIC_RECLAIM_APP_ID!,
        process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET!,
        provider.providerId,
        {
          useAppClip: false,
          customSharePageUrl: process.env.NEXT_PUBLIC_WEBSDK_URL!,
        }
      )

      setReclaimProofRequest(proofRequest)
    } catch (error) {
      console.error('Error initializing ReclaimProofRequest:', error)
      setError('Failed to initialize Reclaim. Please try again.')
    }
  }

  async function startClaimProcess() {
    if (!reclaimProofRequest) {
      setError('Reclaim not initialized. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setError(null);

    let proofWindow: Window | null = null;

    try {
      // Pre-emptively open a blank tab for iOS Safari + localhost compatibility
      proofWindow = window.open('about:blank', '_blank');

      // Check if popup was blocked
      if (!proofWindow || proofWindow.closed) {
        setIsLoading(false);
        setError('Popup was blocked. Please allow popups for this site and try again.');
        return;
      }

      // Add loading message to the popup window
  

      // Fetch the request URL asynchronously
      const requestUrlLink = await reclaimProofRequest.getRequestUrl();
      setRequestUrl(requestUrlLink);

      // Verify the window is still open before navigating
      if (!proofWindow || proofWindow.closed) {
        setIsLoading(false);
        setError('Popup window was closed before loading. Please try again.');
        return;
      }

      // Navigate the already-opened tab to the real URL
      proofWindow.location.href = requestUrlLink;

      // Start the Reclaim session
      await reclaimProofRequest.startSession({
        onSuccess: (proof) => {
          setIsLoading(false);
          if (proof && typeof proof !== 'string') {
            setProofData(Array.isArray(proof) ? proof : [proof]);
          } else {
            setError('Received string response instead of proof object.');
          }
        },
        onError: (error: Error) => {
          setIsLoading(false);
          setError(`Error: ${error.message}`);
          // Close the popup window on error
          if (proofWindow && !proofWindow.closed) {
            proofWindow.close();
          }
        },
      });
    } catch (error) {
      setIsLoading(false);
      setError('Failed to start verification. Please try again.');
      // Close the popup window on error
      if (proofWindow && !proofWindow.closed) {
        try {
          proofWindow.close();
        } catch (e) {
          console.log('Could not close popup window');
        }
      }
    }
  }

  // Function to extract provider URL from parameters
  const getProviderUrl = (proof: Proof) => {
    try {
      const parameters = JSON.parse(proof.claimData.parameters);
      return parameters.url || "Unknown Provider";
    } catch (e) {
      return proof.claimData.provider || "Unknown Provider";
    }
  }

  // Function to beautify and display extracted parameters
  const renderExtractedParameters = (proof: Proof) => {
    try {
      const context = JSON.parse(proof.claimData.context)
      const extractedParams = context.extractedParameters || {}

      return (
        <>
          <p className="text-sm font-medium text-gray-500 mb-2">Extracted Parameters</p>
          {Object.entries(extractedParams).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(extractedParams).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-2 rounded">
                  <div className="flex flex-col">
                    <span className="font-medium">{key}:</span>
                    <span className="font-mono break-all">{String(value)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 bg-gray-50 p-2 rounded">No parameters extracted</p>
          )}
        </>
      )
    } catch (e) {
      return <p className="text-red-500 bg-gray-50 p-2 rounded">Failed to parse parameters</p>
    }
  }

  return (
    <main className='flex min-h-screen flex-col items-center p-8 bg-gray-50'>
      <div className='max-w-4xl w-full mx-auto'>
        <h1 className='text-3xl font-bold mb-8 text-center'>Reclaim Web SDK</h1>

        {/* Provider Selection - Only show if there are multiple providers */}
        {!proofData && !isLoading && providers.length > 1 && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Provider
            </label>
            <select
              value={selectedProvider?.providerId || ''}
              onChange={(e) => {
                const provider = providers.find(p => p.providerId === e.target.value);
                setSelectedProvider(provider || null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {providers.map((provider) => (
                <option key={provider.providerId} value={provider.providerId}>
                  {provider.providerName}
                </option>
              ))}
            </select>
            {selectedProvider && (
              <p className="mt-2 text-sm text-gray-500">
                Provider ID: {selectedProvider.providerId}
              </p>
            )}
          </div>
        )}

        {!proofData && !isLoading && (
          <div className="text-center">
            <button
              onClick={startClaimProcess}
              className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={!reclaimProofRequest || !selectedProvider}
            >
              Start Claim Process
            </button>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-700">Processing your claim...</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        {proofData && proofData.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Verification Successful</h2>

            {proofData.map((proof, index) => (
              <div key={index} className="mb-8 bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-medium">Proof #{index + 1}</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Verified</span>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Provider</p>
                    <p className="font-medium break-all">{getProviderUrl(proof)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Timestamp</p>
                    <p>{new Date(proof.claimData.timestampS * 1000).toLocaleString()}</p>
                  </div>
                </div>

                {/* Extracted parameters section */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  {renderExtractedParameters(proof)}
                </div>

                {/* Witnesses section */}
                {proof.witnesses && proof.witnesses.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-2">Attested by</p>
                    <div className="space-y-2">
                      {proof.witnesses.map((witness, widx) => (
                        <div key={widx} className="bg-gray-50 p-2 rounded">
                          <p className="text-sm font-mono break-all">{witness.id}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Signatures section */}
                {proof.signatures && proof.signatures.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-2">Signatures</p>
                    <div className="space-y-2">
                      {proof.signatures.map((signature, sidx) => (
                        <div key={sidx} className="bg-gray-50 p-2 rounded">
                          <p className="text-sm font-mono break-all">{signature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Identifier (full) */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-2">Proof Identifier</p>
                  <p className="text-sm text-gray-600 font-mono break-all bg-gray-50 p-2 rounded">
                    {proof.identifier}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                setProofData(null);
                setError(null);
                setRequestUrl(null);
                if(selectedProvider) {
                  initializeReclaimProofRequest(selectedProvider);
                }
               
              }}
              className="mt-4 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium shadow-sm w-full md:w-auto"
            >
              Start New Claim
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
