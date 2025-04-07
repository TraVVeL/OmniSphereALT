import React, { useState, useCallback } from 'react';
import { Button, ButtonGroup, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function SwitchModal({ isLogin, setIsLogin }) {
    const [position, setPosition] = useState(isLogin ? 'left' : 'right');
    const [animationClass, setAnimationClass] = useState('');
    const { t } = useTranslation();

    const handleButtonClick = useCallback((newPosition, animationClass) => {
        if (position !== newPosition) {
            setPosition(newPosition);
            setAnimationClass(animationClass);
            setIsLogin(newPosition === 'left');
        }
    }, [position, setIsLogin]);

    return (
        <div className="d-flex justify-content-center align-items-center mb-3 position-relative">
            <Row className="w-100">
                <div 
                    className={`rounded p-2 bg-primary position-absolute w-50 h-100 ${animationClass}`}
                    style={{ left: position === 'left' ? '0' : '50%' }}
                />
                <ButtonGroup className='px-0 w-100 position-relative'>
                    <Button 
                        variant='outline-secondary text-body'
                        size='lg'
                        onClick={() => handleButtonClick('left', 'slideLeft')}
                        className='w-50 position-relative border-end-0 no-hover'
                    >
                        {t('login')}
                    </Button>
                    <Button 
                        variant='outline-secondary text-body'
                        size='lg'
                        onClick={() => handleButtonClick('right', 'slideRight')}
                        className='w-50 position-relative border-start-0 no-hover'
                    >
                        {t('register')}
                    </Button>
                </ButtonGroup>
            </Row>
        </div>
    );
}

export default React.memo(SwitchModal);
