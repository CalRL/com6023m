import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../../src/pages/HomePage';
import '@testing-library/jest-dom';
import { test, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import axios from '../../src/api/axios';

vi.mock('../../src/api/axios');
const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useOutletContext: () => ({ setRefreshPostsCallback: vi.fn() }),
    };
});

test('renders empty state when no posts', async () => {
    mockedAxios.get.mockResolvedValue({ data: { posts: [] } });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    await waitFor(() => {
        expect(screen.getByText(/no posts/i)).toBeInTheDocument();
    });
});
