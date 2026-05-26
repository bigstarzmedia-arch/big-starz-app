import { useState, useCallback } from 'react';

export type VerificationStep = 'email' | 'identity' | 'bank' | 'complete';
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired';

export interface VerificationData {
  email: string;
  emailVerified: boolean;
  identityVerified: boolean;
  bankVerified: boolean;
  status: VerificationStatus;
  completedAt?: number;
  rejectionReason?: string;
}

/**
 * Hook for managing creator verification flow
 * Required for Affiliate Program access
 */
export function useCreatorVerification() {
  const [currentStep, setCurrentStep] = useState<VerificationStep>('email');
  const [verificationData, setVerificationData] = useState<VerificationData>({
    email: '',
    emailVerified: false,
    identityVerified: false,
    bankVerified: false,
    status: 'pending',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verify email with OTP
  const verifyEmail = useCallback(async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call to verify email
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Validate OTP format (6 digits)
      if (!/^\d{6}$/.test(otp)) {
        throw new Error('Invalid OTP format');
      }

      setVerificationData((prev) => ({
        ...prev,
        email,
        emailVerified: true,
      }));

      setCurrentStep('identity');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Email verification failed';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify identity with ID document
  const verifyIdentity = useCallback(
    async (
      firstName: string,
      lastName: string,
      dateOfBirth: string,
      idType: 'passport' | 'drivers_license' | 'national_id',
      idNumber: string,
      idImageUri: string
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        // Validate inputs
        if (!firstName || !lastName || !dateOfBirth || !idNumber) {
          throw new Error('All fields are required');
        }

        // Simulate API call to verify identity
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setVerificationData((prev) => ({
          ...prev,
          identityVerified: true,
        }));

        setCurrentStep('bank');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Identity verification failed';
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Verify bank account
  const verifyBank = useCallback(
    async (
      accountHolderName: string,
      accountNumber: string,
      routingNumber: string,
      bankName: string
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        // Validate inputs
        if (!accountHolderName || !accountNumber || !routingNumber || !bankName) {
          throw new Error('All fields are required');
        }

        // Validate account number (8-17 digits)
        if (!/^\d{8,17}$/.test(accountNumber)) {
          throw new Error('Invalid account number');
        }

        // Validate routing number (9 digits for US)
        if (!/^\d{9}$/.test(routingNumber)) {
          throw new Error('Invalid routing number');
        }

        // Simulate API call to verify bank
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setVerificationData((prev) => ({
          ...prev,
          bankVerified: true,
          status: 'verified',
          completedAt: Date.now(),
        }));

        setCurrentStep('complete');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Bank verification failed';
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Check if creator is fully verified
  const isFullyVerified = useCallback(() => {
    return (
      verificationData.emailVerified &&
      verificationData.identityVerified &&
      verificationData.bankVerified &&
      verificationData.status === 'verified'
    );
  }, [verificationData]);

  // Get verification progress percentage
  const getVerificationProgress = useCallback(() => {
    let progress = 0;
    if (verificationData.emailVerified) progress += 33;
    if (verificationData.identityVerified) progress += 33;
    if (verificationData.bankVerified) progress += 34;
    return progress;
  }, [verificationData]);

  // Reset verification process
  const resetVerification = useCallback(() => {
    setCurrentStep('email');
    setVerificationData({
      email: '',
      emailVerified: false,
      identityVerified: false,
      bankVerified: false,
      status: 'pending',
    });
    setError(null);
  }, []);

  return {
    currentStep,
    verificationData,
    isLoading,
    error,
    verifyEmail,
    verifyIdentity,
    verifyBank,
    isFullyVerified,
    getVerificationProgress,
    resetVerification,
  };
}
