import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import TabOneScreen from '../pages/Home/home';
import { useAuth } from '../context/UserAuthContext';
import { fetchMonthTasks, fetchReminders, fetchOutDatedSpots, fetchRiskySpots, fetchUnfinishedSpots, fetchUserData } from '../services/server';

// Mock the modules
jest.mock('../context/UserAuthContext');
jest.mock('../services/server', () => ({
  fetchMonthTasks: jest.fn(),
  fetchReminders: jest.fn(),
  fetchOutDatedSpots: jest.fn(),
  fetchRiskySpots: jest.fn(),
  fetchUnfinishedSpots: jest.fn(),
  fetchUserData: jest.fn()
}));

describe('TabOneScreen', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({ currentuser: { uid: 'testUserId' } });
      fetchMonthTasks.mockResolvedValue([]);
      fetchReminders.mockResolvedValue([]);
      fetchOutDatedSpots.mockResolvedValue([]);
      fetchRiskySpots.mockResolvedValue([]);
      fetchUnfinishedSpots.mockResolvedValue([]);
      fetchUserData.mockResolvedValue([]);
    });
  
    it('renders correctly', async () => {
      await act(async () => {
        const { getByText, getByTestId } = render(<TabOneScreen navigation={{ navigate: jest.fn() }} />);
  
        // Check if the Calendar component is rendered
        await waitFor(() => {
          expect(getByTestId('horizontal-calendar')).toBeTruthy();
        });
  
        // Check if the StatusBar component is rendered
        expect(getByText('auto')).toBeTruthy();
        
        // Add more assertions based on what you expect to be in the DOM
      });
    });
  
    it('handles refresh correctly', async () => {
      await act(async () => {
        const { getByTestId } = render(<TabOneScreen navigation={{ navigate: jest.fn() }} />);
  
        const refreshControl = getByTestId('refresh-control');
  
        await act(async () => {
          fireEvent(refreshControl, 'refresh');
        });
  
        // Wait for the refreshing state to be true
        await waitFor(() => expect(refreshControl.props.refreshing).toBe(true));
  
        // Wait for the refreshing state to be false again
        await waitFor(() => expect(refreshControl.props.refreshing).toBe(false), { timeout: 3000 });
  
        // Ensure that the fetch functions were called
        expect(fetchMonthTasks).toHaveBeenCalledWith({ userId: 'testUserId', month: expect.any(String), year: expect.any(String) });
        expect(fetchReminders).toHaveBeenCalledWith({ userId: 'testUserId' });
        expect(fetchOutDatedSpots).toHaveBeenCalledWith({ userId: 'testUserId' });
        expect(fetchRiskySpots).toHaveBeenCalledWith({ userId: 'testUserId' });
        expect(fetchUnfinishedSpots).toHaveBeenCalledWith({ userId: 'testUserId' });
        expect(fetchUserData).toHaveBeenCalledWith({ userId: 'testUserId' });
      });
    });
  });