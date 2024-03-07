import { useDispatch, useSelector } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import {
  checkAsset,
  uncheckAsset,
  uncheckAssetAll,
} from "@store/myAssets.duck";

// Checkbox selection of assets
const SelectedAssets = ({ checkedAsset, disabled, selectAll }) => {
  const {
    assets: { selectedAssets },
  } = useSelector((state) => state.myAssets);
  const dispatch = useDispatch();

  let isChecked = false;
  let selectAllChecked = false;

  for (let item of selectedAssets) {
    if (item.id === checkedAsset.id) {
      isChecked = true;
    }
  }

  if (selectedAssets.length === checkedAsset.length) {
    selectAllChecked = true;
  }

  const checked = (e) => {
    const checked = e.target.checked;
    if (selectAll) {
      if (checked) {
        dispatch(checkAsset({ checkedAsset, selectAll: true }));
      } else {
        dispatch(uncheckAssetAll({}));
      }
    } else {
      checked
        ? dispatch(
            checkAsset({ checkedAsset: [checkedAsset], selectAll: false })
          )
        : dispatch(
            uncheckAsset({ checkedAsset: [checkedAsset], selectAll: false })
          );
    }
  };

  return (
    <section>
      {!disabled && (
        <Checkbox
          sx={{
            color: "#00a3d6",
            padding: 0,
            "&.Mui-checked": {
              color: "#00a3d6",
            },
          }}
          checked={isChecked || selectAllChecked}
          disabled={disabled}
          id={String(checkedAsset.id) || ""}
          onChange={(e) => checked(e)}
        />
      )}
    </section>
  );
};

export default SelectedAssets;
