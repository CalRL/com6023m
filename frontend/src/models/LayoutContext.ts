export interface LayoutContext {
    setRefreshPostsCallback?: (cb: () => void) => void;
    refreshPosts?: () => void;

    setRefreshRepliesCallback?: (cb: () => void) => void;
    refreshReplies?: () => void;
}
