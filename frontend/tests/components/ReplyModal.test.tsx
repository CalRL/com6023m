import { render, screen, fireEvent } from '@testing-library/react';
import ReplyModal from '../../src/components/modal/ReplyModal';
import '@testing-library/jest-dom';
import { test, expect, vi } from 'vitest';
import {useState} from "react";


test('displays modal and handles submit', () => {
    const handleSubmit = vi.fn();

    function TestWrapper() {
        const [content, setContent] = useState('');
        return (
            <ReplyModal
                open={true}
                onClose={() => {}}
                onSubmit={handleSubmit}
                username="tester"
                content={content}
                setContent={setContent}
            />
        );
    }

    render(<TestWrapper />);

    const textbox = screen.getByRole('textbox');
    fireEvent.change(textbox, { target: { value: 'Reply text' } });

    const replyButton = screen.getByRole('button', { name: /^reply$/i });
    fireEvent.click(replyButton);

    expect(textbox).toHaveValue('Reply text');
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith('Reply text');
});

test('calls onClose when cancel button is clicked', () => {
    const handleClose = vi.fn();

    render(
        <ReplyModal
            open={true}
            onClose={handleClose}
            onSubmit={vi.fn()}
            username="tester"
            content="Some content"
            setContent={vi.fn()}
        />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(handleClose).toHaveBeenCalled();
});

test('does not call onSubmit with empty reply', () => {
    const handleSubmit = vi.fn();

    render(
        <ReplyModal
            open={true}
            onClose={vi.fn()}
            onSubmit={handleSubmit}
            username="tester"
            content=""
            setContent={vi.fn()}
        />
    );

    const replyButton = screen.getByRole('button', { name: /^reply$/i });
    fireEvent.click(replyButton);

    expect(handleSubmit).not.toHaveBeenCalled();
});
