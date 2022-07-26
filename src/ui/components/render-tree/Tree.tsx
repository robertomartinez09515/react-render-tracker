import * as React from "react";
import { useFiberChildren } from "../../utils/fiber-maps";
import { TreeViewSettings, TreeViewSettingsContext } from "./contexts";
import TreeLeaf from "./TreeLeaf";

const Tree = ({
  rootId = 0,
  groupByParent = false,
  showUnmounted = true,
  showTimings = false,
}: {
  rootId: number;
  groupByParent?: boolean;
  showUnmounted?: boolean;
  showTimings?: boolean;
}) => {
  const children = useFiberChildren(rootId, groupByParent, showUnmounted);
  const viewSettings = React.useMemo<TreeViewSettings>(
    () => ({
      groupByParent,
      showUnmounted,
      showTimings,
    }),
    [groupByParent, showUnmounted, showTimings]
  );

  return (
    <div className="render-tree">
      <div className="render-tree__content">
        <TreeViewSettingsContext.Provider value={viewSettings}>
          {children.map(childId => (
            <TreeLeaf key={childId} fiberId={childId} />
          ))}
        </TreeViewSettingsContext.Provider>
      </div>
    </div>
  );
};

const TreeMemo = React.memo(Tree);
TreeMemo.displayName = "Tree";

export default TreeMemo;
