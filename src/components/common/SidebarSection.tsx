import type { ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { SidebarGroup, SidebarMenu } from "../ui/sidebar";

type SidebarSectionProps = {
    title: string,
    children: ReactNode
}

export default function SidebarSection({ title, children }: SidebarSectionProps) {
    return (
        <SidebarGroup>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="settings">
                    <AccordionTrigger className="px-2 py-2 mb-0.5 text-md font-semibold no-underline text-foreground">
                        {title}
                    </AccordionTrigger>

                    <AccordionContent>
                        <SidebarMenu>
                            {children}
                        </SidebarMenu>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </SidebarGroup>
    )
}
