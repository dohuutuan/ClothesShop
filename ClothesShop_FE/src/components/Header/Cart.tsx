import Badge from '@mui/material/Badge';
import type { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function Cart({quantity = 0, onClick}: {quantity?: number, onClick?: () => void}) {
  return (
    <IconButton aria-label="cart" onClick={onClick}>
      <StyledBadge badgeContent={quantity} color="error" max={99}>
        <ShoppingCartIcon color='primary' />
      </StyledBadge>
    </IconButton>
  );
}
