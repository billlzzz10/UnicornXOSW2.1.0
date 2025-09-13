import React from 'react';
import { AiPersonality } from '../../../types';
import { APP_ROADMAP_MARKDOWN } from '../../../constants';
import { getSafeHtml } from '../../../utils';
import Icon from '../Icon';

/**
 * @interface SettingsViewProps
 * @description Props for the SettingsView component.
 */
interface SettingsViewProps {
  defaultAiPersonalityId: string;
  onSetDefaultAiPersonalityId: (id: string) => void;
  allAiPersonalities: AiPersonality[];
}

/**
 * A view for managing application settings.
 * @param {SettingsViewProps} props - The props for the component.
 */
const SettingsView: React.FC<SettingsViewProps> = ({
  defaultAiPersonalityId,
  onSetDefaultAiPersonalityId,
  allAiPersonalities,
}) => {
  return (
    <div className="space-y-8">
      <h1>Settings</h1>
      <div>
        <h2>AI Writer Settings</h2>
        <label htmlFor="ai-personality-select">Default AI Personality:</label>
        <select
          id="ai-personality-select"
          value={defaultAiPersonalityId}
          onChange={(e) => onSetDefaultAiPersonalityId(e.target.value)}
        >
          {allAiPersonalities.map(personality => (
            <option key={personality.id} value={personality.id}>
              {personality.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h2>Roadmap</h2>
        <div dangerouslySetInnerHTML={getSafeHtml(APP_ROADMAP_MARKDOWN)} />
      </div>
    </div>
  );
};

export default SettingsView;
