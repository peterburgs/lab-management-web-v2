import React, { MouseEventHandler } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import styled from "styled-components";

export interface CheckboxItem {
  _id: string;
  name: string;
}

interface CheckboxListProps {
  items: CheckboxItem[];
  onSelectItem: (
    item: CheckboxItem
  ) => MouseEventHandler<HTMLDivElement>;
  selectedItems: CheckboxItem[];
}

const CheckboxList = (props: CheckboxListProps) => {
  return (
    <List>
      {props.items.map((item) => {
        const labelId = `checkbox-list-label-${item._id}`;
        return (
          <ListItem
            key={item._id}
            role={undefined}
            dense
            button
            onClick={props.onSelectItem(item)}
          >
            <ListItemIcon style={{ minWidth: "30px" }}>
              <Checkbox
                edge="start"
                checked={
                  props.selectedItems.findIndex(
                    (e) => e._id === item._id
                  ) !== -1
                }
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": labelId }}
              />
            </ListItemIcon>
            <ListItemText
              id={labelId}
              primary={<ItemText>{item.name}</ItemText>}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

const ItemText = styled.p`
  font-size: 14px;

  & > span {
    color: ${({ theme }) => theme.grey};
  }
`;

export default CheckboxList;
