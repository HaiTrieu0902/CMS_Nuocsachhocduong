import { useCallback, useState } from 'react';

interface IStateModal {
  open: boolean;
  typeModal: 'add' | 'delete' | 'edit' | 'view';
  data?: any;
}
const useModal = () => {
  const [stateModal, setStateModal] = useState<IStateModal>({
    open: false,
    typeModal: 'add',
  });

  const toggleModal = useCallback(
    (bool: boolean, type: 'add' | 'delete' | 'edit' | 'view', data: any) => () => {
      setStateModal((state) => ({ ...state, open: bool, typeModal: type, data }));
    },
    [],
  );

  const offModal = () => {
    setStateModal((state) => ({ ...state, open: false }));
  };

  return { stateModal, toggleModal, offModal };
};

export default useModal;
