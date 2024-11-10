import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import DataPane from "@/components/Data/DataPane";

export default function Home() {
  return (
    <div className="h-screen w-full flex overflow-hidden">
      <Tabs defaultValue="data" className="w-full h-full flex flex-col m-2 ">
        <TabsList className="flex-shrink-0 w-full">
          <SidebarTrigger />
          <TabsTrigger value="design" className="w-1/2">
            Design
          </TabsTrigger>
          <TabsTrigger value="data" className="w-1/2">
            Data
          </TabsTrigger>
        </TabsList>
        <TabsContent value="design" className="flex-1 overflow-hidden">
          Design
        </TabsContent>
        <TabsContent
          value="data"
          className="flex-1 overflow-auto scrollbar-thin"
        >
          <DataPane />
        </TabsContent>
      </Tabs>
    </div>
  );
}
