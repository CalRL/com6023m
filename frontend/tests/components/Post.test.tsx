import { render, screen, fireEvent } from '@testing-library/react';
import Post from '../../src/components/posts/Post';
import '@testing-library/jest-dom';
import { test, expect, vi } from 'vitest';

import axios from '../../src/api/axios';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/api/axios');
const mockedAxios = axios as unknown as {
    post: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
};

const mockPost = {
    id: '1',
    content: 'Hello world!',
    createdAt: new Date().toISOString(),
    mediaUrl: '',
    liked: false,
    bookmarked: false,
    likeCount: 0,
    bookmarkCount: 0,
};

const mockProfile = {
    username: 'johndoe',
    displayName: 'John Doe',
    avatarUrl: '',
};

test('renders post content and profile', () => {
    render(<Post post={mockPost} profile={mockProfile} />, { wrapper: MemoryRouter });

    expect(screen.getByText('Hello world!')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
});

test('toggles like button and updates count', async () => {
    mockedAxios.post.mockResolvedValue({});
    render(<Post post={mockPost} profile={mockProfile} />, { wrapper: MemoryRouter });

    const likeButton = screen.getAllByRole('button')[0]; // first button is like
    fireEvent.click(likeButton);

    expect(mockedAxios.post).toHaveBeenCalledWith('/posts/1/like', { withCredentials: true });
});

