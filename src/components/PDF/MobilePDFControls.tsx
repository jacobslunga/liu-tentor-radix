import { FC, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  RotateCcw,
  RotateCw,
  Plus,
  Minus,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface MobilePDFControlsProps {
  activeTab: 'exam' | 'facit';
  setActiveTab: (tab: 'exam' | 'facit') => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onFacitZoomIn: () => void;
  onFacitZoomOut: () => void;
  onFacitRotateLeft: () => void;
  onFacitRotateRight: () => void;
  facitPdfUrl: string | null;
  getTranslation: (key: string) => string;
}

const MobilePDFControls: FC<MobilePDFControlsProps> = ({
  activeTab,
  setActiveTab,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onFacitZoomIn,
  onFacitZoomOut,
  onFacitRotateLeft,
  onFacitRotateRight,
  facitPdfUrl,
  getTranslation,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!facitPdfUrl && activeTab === 'facit') {
      setActiveTab('exam');
    }
  }, [facitPdfUrl, activeTab, setActiveTab]);

  const currentZoomIn = () => {
    if (activeTab === 'exam') {
      onZoomIn();
    } else {
      onFacitZoomIn();
    }
  };

  const currentZoomOut = () => {
    if (activeTab === 'exam') {
      onZoomOut();
    } else {
      onFacitZoomOut();
    }
  };

  const currentRotateLeft =
    activeTab === 'exam' ? onRotateLeft : onFacitRotateLeft;
  const currentRotateRight =
    activeTab === 'exam' ? onRotateRight : onFacitRotateRight;

  return (
    <div className='flex items-center justify-between px-4 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95'>
      <div className='flex items-center gap-3'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => navigate(-1)}
          className='h-8 w-8 shrink-0'
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>

        <Tabs
          value={activeTab}
          onValueChange={(v: string) => setActiveTab(v as 'exam' | 'facit')}
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger
              value='exam'
              className='transition-all text-xs duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
            >
              {getTranslation('exam')}
            </TabsTrigger>
            <TabsTrigger
              value='facit'
              disabled={!facitPdfUrl}
              className={cn(
                'transition-all text-xs duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
                !facitPdfUrl &&
                  'opacity-50 cursor-not-allowed hover:bg-transparent'
              )}
              onClick={(e) => {
                if (!facitPdfUrl) {
                  e.preventDefault();
                }
              }}
            >
              {getTranslation('facit')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className='flex items-center gap-2'>
        <Button
          variant='ghost'
          size='icon'
          onClick={currentZoomIn}
          className='h-8 w-8'
        >
          <Plus className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          onClick={currentZoomOut}
          className='h-8 w-8'
        >
          <Minus className='h-4 w-4' />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={currentRotateLeft}>
              <RotateCcw className='h-4 w-4 mr-2' />
              {getTranslation('rotateLeft')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={currentRotateRight}>
              <RotateCw className='h-4 w-4 mr-2' />
              {getTranslation('rotateRight')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MobilePDFControls;
