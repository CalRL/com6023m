import { render, screen, fireEvent } from '@testing-library/react';
import PostModal from '../../src/components/modal/PostModal';
import '@testing-library/jest-dom';
import { test, expect, vi } from 'vitest';
import {useState} from "react";

test('renders PostModal and allows post submission', () => {
    const handleSubmit = vi.fn();

    function TestWrapper() {
        const [content, setContent] = useState('');
        return (
            <PostModal
                open={true}
                onClose={vi.fn()}
                onSubmit={handleSubmit}
                content={content}
                setContent={setContent}
            />
        );
    }

    render(<TestWrapper />);

    const textbox = screen.getByRole('textbox');
    fireEvent.change(textbox, { target: { value: 'Some post' } });

    const postButton = screen.getByRole('button', { name: /^post$/i });
    fireEvent.click(postButton);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith('Some post');
});

test('does not submit empty post', () => {
    const handleSubmit = vi.fn();

    render(
        <PostModal
            open={true}
            onClose={vi.fn()}
            onSubmit={handleSubmit}
            content="   "
            setContent={vi.fn()}
        />
    );

    const postButton = screen.getByRole('button', { name: /^post$/i });
    fireEvent.click(postButton);

    expect(handleSubmit).not.toHaveBeenCalled(); // ✅ should now pass
});


test('calls onClose when cancel is clicked', () => {
    const handleClose = vi.fn();

    render(
        <PostModal
            open={true}
            onClose={handleClose}
            onSubmit={vi.fn()}
            content="Some content"
            setContent={vi.fn()}
        />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(handleClose).toHaveBeenCalled();
});
