import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../../src/pages/HomePage';
import axios from '../../src/api/axios';
import '@testing-library/jest-dom';
import { test, expect, vi } from 'vitest';
import {MemoryRouter} from "react-router-dom";

vi.mock('../../src/api/axios');
const mockedAxios = axios as unknown as {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
};

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useOutletContext: () => ({ setRefreshPostsCallback: vi.fn() }),
    };
});

test('loads and displays posts from API', async () => {
    mockedAxios.get.mockResolvedValue({
        data: {
            posts: [
                {
                    post: { id: '123', content: 'API Content' },
                    profile: { username: 'api_user', displayName: 'API User', avatarUrl: '' }
                }
            ]
        }
    });

    render(
        <MemoryRouter>
            <HomePage />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('API Content')).toBeInTheDocument();
        expect(screen.getByText(/api_user/i)).toBeInTheDocument();
    });
});

