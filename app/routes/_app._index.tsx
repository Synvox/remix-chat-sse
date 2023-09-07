import { mdiAccountGroupOutline } from "@mdi/js";
import { iconOf } from "~/components/Icon";
import { Panel, PanelContent } from "~/components/Panel";

const People = iconOf(mdiAccountGroupOutline);

export default function () {
  return (
    <Panel bg="foreground">
      <PanelContent padding="medium" scroll="none">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-foregroundLighter">
            <People className="h-16 w-16 fill-light" />
          </div>
        </div>
      </PanelContent>
    </Panel>
  );
}
