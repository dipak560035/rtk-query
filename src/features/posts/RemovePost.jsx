import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useRemovePostMutation } from "./postApi";
import toast from "react-hot-toast";

export default function RemovePost({id}) {
    const [RemovePost,{isLoading}] = useRemovePostMutation();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const handleRemove = async () => {
    try{
        await RemovePost(id).unwrap();
        toast.success('post remove successfully');
    } catch (err) {
        toast.error (err.data.message);
    }
  }
  return (
    <>

    <Button 
    isLoading={isLoading}
    onPress={onOpen} isIconOnly aria-label="Like" color="danger">
    <i className="fa-solid fa-trash"></i>
     </Button>

      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Are you sure?</ModalHeader>
              <ModalBody>
                <p>
                  Do you wants to remove this post
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() =>  {
                    handleRemove();
                     onClose();

                }}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
