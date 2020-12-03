import React, { RefObject } from 'react';
import DropdownSelect from '../../../../../../components/ui/DropdownSelect/DropdownSelect';
import DropdownSelectAnchor from '../../../../../../components/ui/DropdownSelect/DropdownSelectAnchor';
import useDropdownSelect from '../../../../../../components/ui/DropdownSelect/useDropdownSelect';
import classNames from '../../../../../../utils/classNames';
import { EditorContainer } from '../../../../containers/EditorContainer/EditorContainer';
import useZoom from '../../../../hooks/useZoom';
import SideMenuSetting from '../../../ui/SideMenuSetting';
import AspectRatioOption from './AspectRatioOption';

export const options = [
  {
    dimensions: { width: 1080, height: 1920 },
    orientation: 'Portrait',
    ratio: '9:16',
  },
  {
    dimensions: { width: 1536, height: 1920 },
    orientation: 'Portrait',
    ratio: '4:5',
  },
  {
    dimensions: { width: 1080, height: 1080 },
    orientation: 'Square',
    ratio: '1:1',
  },
  {
    dimensions: { width: 1920, height: 1080 },
    orientation: 'Landscape',
    ratio: '16:9',
  },
  {
    dimensions: { width: 1920, height: 1536 },
    orientation: 'Landscape',
    ratio: '5:4',
  },
];

interface Props {
  editorAreaRef: RefObject<HTMLDivElement>;
  editorMargin: number;
}

// TODO: select by id or unique key
function AspectRatioSetting({ editorAreaRef, editorMargin }: Props) {
  const { template } = EditorContainer.useContainer();
  const { setTargetElement, targetElement } = useDropdownSelect();
  const { fitToScreen } = useZoom({ editorAreaRef, editorMargin });

  const selectedOption = options.find(
    ({ dimensions }) =>
      dimensions.height === template.dimensions.height &&
      dimensions.width === template.dimensions.width
  )!;

  const handleChangeOption = (value: string) => {
    const { dimensions } = options.find(({ ratio }) => ratio === value)!;
    fitToScreen(dimensions);
  };

  return (
    <SideMenuSetting label="Size">
      <div ref={setTargetElement}>
        <DropdownSelect
          placement="bottom"
          value={selectedOption.ratio}
          onChange={handleChangeOption}
          targetElement={targetElement}
          target={({ open }) => (
            <DropdownSelectAnchor
              className={classNames('panel-item', open && 'border-blue-300')}
            >
              {selectedOption?.orientation} {selectedOption?.ratio}
            </DropdownSelectAnchor>
          )}
        >
          {options.map(({ dimensions, orientation, ratio }) => (
            <AspectRatioOption
              key={`${dimensions.width}x${dimensions.height}`}
              dimensions={dimensions}
              orientation={orientation}
              value={ratio}
            />
          ))}
        </DropdownSelect>
      </div>
    </SideMenuSetting>
  );
}

export default AspectRatioSetting;