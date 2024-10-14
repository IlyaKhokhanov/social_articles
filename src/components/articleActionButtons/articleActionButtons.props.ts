export interface IActionButtons {
  editBtn: {
    cb: () => void;
    text: string;
  };
  deleteBtn?: {
    cb: () => void;
    text: string;
  };
  author?: string;
}
