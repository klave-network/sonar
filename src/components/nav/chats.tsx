import * as React from 'react';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuAction
} from '@/components/ui/sidebar';
import { useSidebar } from '@/hooks/use-sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { useUserChatHistory, storeActions } from '@/store';
import { MoreHorizontal, Text, Trash2 } from 'lucide-react';
import { CUR_USER_KEY } from '@/lib/constants';

export function NavChats({
    ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    const { isMobile } = useSidebar();
    const currentUser = localStorage.getItem(CUR_USER_KEY);
    const chatHistory = useUserChatHistory(currentUser ?? '') ?? [];

    const [showAll, setShowAll] = React.useState(false);

    // Reverse the array to have the most recent chats first
    const reversedChats = [...chatHistory].reverse();

    if (!reversedChats.length)
        return null;

    const handleDeleteChat = (chatId: string) => {
        if (currentUser)
            storeActions.deleteChat(currentUser, chatId);
    }

    // Split into first 5 and remaining
    const firstFive = reversedChats.slice(0, 5);
    const remaining = reversedChats.slice(5);

    return (
        <SidebarGroup {...props}>
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {/* <SidebarMenuItem key="new-chat">
                        <SidebarMenuButton asChild>
                            <Link
                                search
                                to={`/chat`}
                                activeProps={{
                                    className: 'bg-sidebar-accent flex'
                                }}
                            >
                                <MessageCirclePlus />
                                <span>New Chat</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem> */}
                    {/* Render first 5 (most recent) */}
                    {firstFive.map((item) => (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton asChild>
                                <Link
                                    search
                                    to={`/chat/$id`}
                                    params={{ id: item.id }}
                                    activeProps={{
                                        className: 'bg-sidebar-accent'
                                    }}
                                >
                                    <Text />
                                    <span>{item.messages[0].content}</span>
                                </Link>
                            </SidebarMenuButton>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuAction showOnHover>
                                        <MoreHorizontal />
                                        <span className="sr-only">More</span>
                                    </SidebarMenuAction>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-48"
                                    side={isMobile ? 'bottom' : 'right'}
                                    align={isMobile ? 'end' : 'start'}
                                >
                                    <DropdownMenuItem onClick={() => handleDeleteChat(item.id)}>
                                        <Trash2 className="text-muted-foreground" />
                                        <span>Delete Chat</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    ))}

                    {/* Show toggle button if there are more than 5 */}
                    {remaining.length > 0 && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Button
                                    className="justify-start font-medium text-sidebar-foreground/70 hover:cursor-pointer has-[>svg]:px-2"
                                    onClick={() => setShowAll(!showAll)}
                                    variant="ghost"
                                >
                                    {showAll ? (
                                        <>
                                            <MoreHorizontal /> Show less
                                        </>
                                    ) : (
                                        <>
                                            <MoreHorizontal /> Show more
                                        </>
                                    )}
                                </Button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}

                    {/* Conditionally render the remaining chats */}
                    {showAll &&
                        remaining.map((item) => (
                            <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton asChild>
                                    <Link
                                        search
                                        to={`/chat/$id`}
                                        params={{ id: item.id }}
                                        activeProps={{
                                            className: 'bg-sidebar-accent'
                                        }}
                                    >
                                        <span>{item.messages[0].content}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
