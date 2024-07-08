import { Skeleton, Stack } from '@chakra-ui/react';

function ChatLoading() {
    return (
        <div style={{ marginTop: '12px' }}>
            <Stack>
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
            </Stack>
        </div>
    );
}

export default ChatLoading;
