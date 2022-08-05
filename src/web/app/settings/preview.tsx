import { RadioGroup } from "@headlessui/react";
import { LayoutState } from "../layout/type";
import { Settings, SettingsState } from "./type";
import { getLayoutFromSettings } from "./utils";

interface Props extends SettingsState, LayoutState {}

type Preview = Settings["preview"];

const OPTIONS: Preview[] = ["full", "split"];

// https://github.com/tailwindlabs/headlessui/discussions/1743
interface OptionRenderPropArg {
  checked: boolean;
  active: boolean;
  disabled: boolean;
}

export const SettingsPreview = (props: Props): JSX.Element => {
  const { setSettings, settings, layout, setLayout } = props;
  return (
    <RadioGroup<"div", Preview>
      value={settings.preview}
      onChange={(preview: Preview) => {
        setSettings((prev) => ({ ...prev, preview }));

        // Also update Layout if currently in preview mode
        if (layout === "editor") return;
        const next = getLayoutFromSettings(preview);
        if (layout === next) return;
        setLayout(next);
      }}
    >
      <RadioGroup.Label>Preview</RadioGroup.Label>
      {OPTIONS.map((value) => (
        <RadioGroup.Option<"div", Preview> value={value}>
          {({ checked }: OptionRenderPropArg) => (
            <div>
              {value} {checked ? "x" : ""}
            </div>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
};
