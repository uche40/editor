import { CloudDownload } from 'heroicons-react';
import React, { useRef, useState } from 'react';
import useDropdown from '../../../../components/ui/Dropdown/useDropdown';
import Flyout from '../../../../components/ui/Flyout';
import OpenIcon from '../../../../components/ui/Icons/OpenIcon';
import UploadToDiskIcon from '../../../../components/ui/Icons/UploadToDiskIcon';
import { EditorContainer } from '../../containers/EditorContainer/EditorContainer';
import ClearButton from '../ui/ClearButton';
import FlyoutMenuButton from './FlyoutMenuButton';
import { readBlobAsText } from '../../../../utils/blob';
import DiscardChangesModal from '../DiscardChangesModal';
import extractTemplateFonts from '../../utils/template';
import { loadFonts } from '../../../../utils/fonts';

function OpenTemplateButton() {
  const {
    dispatch,
    hasUnsavedChanges,
    state,
    template,
  } = EditorContainer.useContainer();
  const [isDiscardChangesVisible, setDiscardChangesVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    isOpen,
    close,
    open,
    setTargetElement,
    targetElement,
  } = useDropdown();

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (
      file &&
      (file.type === 'application/json' || file.name.endsWith('.json'))
    ) {
      try {
        const template = JSON.parse(await readBlobAsText(file));
        const fonts = extractTemplateFonts(template);

        if (fonts.length) {
          const loadingTimeout = setTimeout(() => {
            dispatch({ type: 'loading_template' });
          }, 1000);

          await loadFonts(fonts);

          // Do not show loader if all fonts loaded from cache
          clearTimeout(loadingTimeout);
        }

        dispatch({
          type: 'load_template',
          template,
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleClickOpen = () => {
    if (hasUnsavedChanges) {
      setDiscardChangesVisible(true);
    } else {
      inputRef.current?.click();
    }
  };

  const handleDiscardClick = () => {
    inputRef.current?.click();
    setDiscardChangesVisible(false);
  };

  const handleCancelDiscardClick = () => {
    setDiscardChangesVisible(false);
  };

  return (
    <>
      <DiscardChangesModal
        visible={isDiscardChangesVisible}
        ok={handleDiscardClick}
        cancel={handleCancelDiscardClick}
      />
      <input
        ref={inputRef}
        type="file"
        onChange={handleChangeFile}
        className="hidden"
        accept=".json,application/json"
      />
      <ClearButton
        onClick={open}
        ref={setTargetElement}
        icon={OpenIcon}
        className="px-2.5"
      >
        Open template
      </ClearButton>
      <Flyout
        className="p-3 space-y-2"
        targetElement={targetElement}
        isOpen={isOpen}
        close={close}
      >
        <FlyoutMenuButton
          title="Open from disk"
          description="Select the template file from your computer"
          onClick={handleClickOpen}
          icon={UploadToDiskIcon}
        />
        <FlyoutMenuButton
          title="Import from cloud"
          description="Download the template from mediabits.io cloud (PRO)"
          onClick={() => console.info('not implemented yet')}
          icon={CloudDownload}
          onlyPro
        />
      </Flyout>
    </>
  );
}

export default OpenTemplateButton;
