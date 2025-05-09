---
title: Create useJudgeMe React Hook
type: task
status: completed
created: 2025-05-07T15:46:13-06:00
updated: 2025-05-07T23:05:49-06:00
id: TASK-108
priority: high
memory_types: [procedural, semantic]
dependencies: [TASK-107]
tags: [judge.me, integration, hooks, react]
---

# Create useJudgeMe React Hook

## Description
Create a custom React hook that provides access to Judge.me functionality throughout the application. This hook will handle script loading state, initialization, and expose Judge.me methods in a React-friendly way. This follows best practices for integrating third-party scripts into React applications.

## Objectives
- Create a custom React hook to manage Judge.me integration
- Provide loading/error states for components to properly handle script initialization
- Ensure components can easily access Judge.me functionality
- Maintain React best practices around effects and state management

## Steps
1. Create a new file in the hooks directory:
   ```
   src/hooks/useJudgeMe.ts
   ```

2. Implement the useJudgeMe hook:
   ```typescript
   import { useState, useEffect, useCallback } from 'react';
   import JudgeMeService from '../services/judgeMe';

   interface UseJudgeMeReturn {
     isLoading: boolean;
     isReady: boolean;
     error: Error | null;
     refreshWidgets: () => void;
     getReviewCount: (productId: string) => number | null;
     getAverageRating: (productId: string) => number | null;
   }

   /**
    * Hook to use Judge.me functionality in React components
    * 
    * @param autoLoad Whether to automatically load the Judge.me script on mount
    * @returns Object with loading state and Judge.me methods
    */
   export const useJudgeMe = (autoLoad = true): UseJudgeMeReturn => {
     const [isLoading, setIsLoading] = useState<boolean>(false);
     const [isReady, setIsReady] = useState<boolean>(JudgeMeService.isReady());
     const [error, setError] = useState<Error | null>(null);

     // Load Judge.me script
     const loadScript = useCallback(async () => {
       if (isReady || isLoading) return;
       
       setIsLoading(true);
       setError(null);
       
       try {
         await JudgeMeService.load(
           // onLoad callback
           () => {
             setIsReady(true);
             setIsLoading(false);
           },
           // onError callback
           (err) => {
             setError(err);
             setIsLoading(false);
           }
         );
       } catch (err) {
         setError(err as Error);
         setIsLoading(false);
       }
     }, [isReady, isLoading]);

     // Auto-load script on mount if autoLoad is true
     useEffect(() => {
       if (autoLoad) {
         loadScript();
       }
     }, [autoLoad, loadScript]);

     // Refresh widgets method
     const refreshWidgets = useCallback(() => {
       JudgeMeService.refreshWidgets();
     }, []);

     // Get review count method
     const getReviewCount = useCallback((productId: string): number | null => {
       return JudgeMeService.getReviewCount(productId);
     }, []);

     // Get average rating method
     const getAverageRating = useCallback((productId: string): number | null => {
       return JudgeMeService.getAverageRating(productId);
     }, []);

     return {
       isLoading,
       isReady,
       error,
       refreshWidgets,
       getReviewCount,
       getAverageRating
     };
   };

   export default useJudgeMe;
   ```

3. Add test file for the hook:
   ```
   src/hooks/__tests__/useJudgeMe.test.ts
   ```

4. Implement the test file:
   ```typescript
   import { renderHook, act } from '@testing-library/react-hooks';
   import useJudgeMe from '../useJudgeMe';
   import JudgeMeService from '../../services/judgeMe';

   // Mock the JudgeMeService
   jest.mock('../../services/judgeMe', () => ({
     load: jest.fn(() => Promise.resolve()),
     isReady: jest.fn(),
     refreshWidgets: jest.fn(),
     getReviewCount: jest.fn(),
     getAverageRating: jest.fn(),
   }));

   describe('useJudgeMe', () => {
     beforeEach(() => {
       jest.clearAllMocks();
       (JudgeMeService.isReady as jest.Mock).mockReturnValue(false);
     });

     it('should not load script if autoLoad is false', () => {
       renderHook(() => useJudgeMe(false));
       expect(JudgeMeService.load).not.toHaveBeenCalled();
     });

     it('should load script if autoLoad is true', () => {
       renderHook(() => useJudgeMe(true));
       expect(JudgeMeService.load).toHaveBeenCalled();
     });

     it('should set isReady to true when script is loaded', async () => {
       let loadCallback: Function | undefined;
       
       (JudgeMeService.load as jest.Mock).mockImplementation((onLoad) => {
         loadCallback = onLoad;
         return Promise.resolve();
       });

       const { result, waitForNextUpdate } = renderHook(() => useJudgeMe());
       
       expect(result.current.isLoading).toBe(true);
       expect(result.current.isReady).toBe(false);
       
       if (loadCallback) {
         await act(async () => {
           loadCallback();
           await waitForNextUpdate();
         });
       }
       
       expect(result.current.isLoading).toBe(false);
       expect(result.current.isReady).toBe(true);
     });

     it('should handle errors during script loading', async () => {
       let errorCallback: Function | undefined;
       const testError = new Error('Test error');
       
       (JudgeMeService.load as jest.Mock).mockImplementation((onLoad, onError) => {
         errorCallback = onError;
         return Promise.resolve();
       });

       const { result, waitForNextUpdate } = renderHook(() => useJudgeMe());
       
       expect(result.current.isLoading).toBe(true);
       expect(result.current.error).toBe(null);
       
       if (errorCallback) {
         await act(async () => {
           errorCallback(testError);
           await waitForNextUpdate();
         });
       }
       
       expect(result.current.isLoading).toBe(false);
       expect(result.current.error).toEqual(testError);
     });

     it('should provide Judge.me methods', () => {
       const { result } = renderHook(() => useJudgeMe(false));
       
       result.current.refreshWidgets();
       expect(JudgeMeService.refreshWidgets).toHaveBeenCalled();
       
       result.current.getReviewCount('123');
       expect(JudgeMeService.getReviewCount).toHaveBeenCalledWith('123');
       
       result.current.getAverageRating('123');
       expect(JudgeMeService.getAverageRating).toHaveBeenCalledWith('123');
     });
   });
   ```

## Progress
- [x] Create useJudgeMe.ts hook file
- [x] Implement script loading and state management
- [x] Expose Judge.me methods through the hook
- [x] Create tests for the hook
- [x] Verify integration with JudgeMeService

## Dependencies
- TASK-107 (Create Judge.me Script Manager Service)

## Test Status
- Status: Not Started
- Test Files: src/hooks/__tests__/useJudgeMe.test.ts (to be created)

## Notes
- The hook follows React best practices for effect cleanup and dependency management
- We're using useCallback to avoid unnecessary re-renders when passing methods to child components
- The hook is designed to work with both eager loading (on component mount) and lazy loading scenarios
- Error handling is provided for script loading failures
- Tests are included to ensure proper functionality

## Next Steps
- Implement global script initialization in the application
